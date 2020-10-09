import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import moment from 'moment';

import data from '../data.js';
import data1 from '../data-1.js';

import Delivery from '../models/deliveryModel.js';
import Courier from '../models/courierModel.js';
import { isSender, isCourier, isAdmin } from '../utils.js';

const deliveryRouter = express.Router();

function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  return today;
}

function convertToISODate(dateString) {  
  var splitString = dateString.split("/");
  var day = splitString[0];
  var month  = splitString[1];
  var year  = splitString[2];
 
  var today = new Date();
  today = year + '-' + month + '-' + day + 'T21:00:00.000Z';
  return new Date(today);
}

deliveryRouter.get(
  '/seed',
  isSender,
  expressAsyncHandler(async (req, res) => {
    await Delivery.deleteMany({}); //because using of ObjectId reference
    const createdDeliveries = await Delivery.insertMany(data.deliveries);
    res.send({ createdDeliveries });
  }),
);

//only adds new deliveries from data-1.json (NOT REMOVE NOTHING BEFORE ADDING !!!)
deliveryRouter.get(
  '/seed-1',
  isSender,
  expressAsyncHandler(async (req, res) => {
    const createdDeliveries = await Delivery.insertMany(data1.deliveries);
    res.send({ createdDeliveries });
  }),
);

deliveryRouter.get('/all', isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page); // Make sure to parse the limit to number
    const limit = parseInt(req.query.limit);// Make sure to parse the skip to number

    if(!page || !limit) {
      res.send('You must surply page & limit parameters');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit ;

    const deliveries = await Delivery.find({});
    if (deliveries) {
       const resultDeliveries = deliveries.slice(startIndex, endIndex)
       res.send(resultDeliveries);
    }
  } catch(e){
    return res.status(500).json(e)
  }
});


deliveryRouter.get('/sender', isSender, async (req, res) => {
  console.log("courierId: " ,req.user._id)
  const query = req.query.date? { date: req.query.date } : {};
  if(query) {
    if (moment(query.date, 'DD/MM/YYYY', true).isValid()) {
      const deliveries = await Delivery.find({ senderId: req.user._id, assignedAt: query.date });
      if (deliveries) {
        res.send({message: `Your assigned deliveries as of date: ${query.date}` , deliveries});
      }
    } else {
      res.status(404).send({ message: 'The date parameter is not formed correctly' });
    }
  }
  else{
    const deliveries = await Delivery.find({ senderId: req.user._id });
    if (deliveries) {
      res.send({message: 'All your created deliveries: ' , deliveries});
    }
  } 
});


deliveryRouter.get('/courier', isCourier, async (req, res) => {
  const query = req.query.date? { date: req.query.date } : {};

  console.log("=============================================================");
  console.log("courier: " ,req.user);

  if (moment(query.date, 'DD/MM/YYYY', true).isValid()) {
    const deliveries = await Delivery.find({ courierId: req.user._id, assignedAt: query.date });
    if (deliveries) {
      res.send(deliveries);
    }
  } else {
    res.status(404).send({ message: 'The date parameter is not formed correctly' });
  }
});


/////http://localhost:5000/api/deliveries/revenue/courier?from=05/10/2020&to=08/10/2020
deliveryRouter.get('/revenue/courier', isCourier, async (req, res) => {

  console.log("=============================================================");
  console.log("courier: " ,req.user);

  const queryFrom = req.query.from? { date: req.query.from } : {};
  const queryTo = req.query.to? { date: req.query.to } : {};
  if (moment(queryFrom.date, 'DD/MM/YYYY', true).isValid() && moment(queryTo.date, 'DD/MM/YYYY', true).isValid()) {

    if(new Date(queryFrom.date) > new Date(queryTo.date)) {
      res.status(404).send({ message: 'Replace from - to dates parameters. Try again !!!' });
    }
  
    
    const dateFrom = convertToISODate(queryFrom.date);
    /////console.log("queryFrom: ", dateFrom);
    const dateTo = convertToISODate(queryTo.date);
    /////console.log("queryTo: ", dateTo);

    
    const deliveries = await Delivery.find({ courierId: req.user._id, assignedAtISO: {"$gte": dateFrom, "$lte": dateTo}});
    //const deliveries = await Delivery.find({ courierId: req.user._id });
    if (deliveries) {
      res.send(deliveries);
    }
  } else {
    res.status(404).send({ message: 'The date parameter is not formed correctly' });
  }
});


deliveryRouter.post('/:id', isSender, async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  /////console.log("Does Assigned yet: ", delivery.courierId)

  // Prevents the same delivery from being assigned more then once
  if (delivery && !delivery.courierId) {
    delivery.sender = {
      name: req.user.name,
      email: req.user.email,
      userId: req.user._id,
    };
    delivery.senderId = req.user._id;

    const couriers = await Courier.find({});

    const requiredVehicleType =
      delivery.deliveryItems[0].size === 'small' || delivery.deliveryItems[0].size === 'middle'
        ? 'sedan'
        : 'track';

    const promises = couriers.map(async (courier) => {
      const deliveryCourierId = courier.user;
      const courierDeliveries = await Delivery.find({
        courierId: courier.id,
        assignedAt: getCurrentDate(),
      });

      if (courierDeliveries.length < 5 && courier.vehicleType === requiredVehicleType) {
        delivery.courier = {
          name: courier.firstName + ' ' + courier.lastName,
          vehicleType: courier.vehicleType,
          userId: courier.user,
        };
        delivery.courierId = deliveryCourierId;
        delivery.assignedAt = getCurrentDate();
        delivery.assignedAtISO = convertToISODate(delivery.assignedAt);
      }
      return;
    });

    await Promise.all(promises);

    const assignedDelivery = await delivery.save();

    const message =
      assignedDelivery.assignedAt === getCurrentDate()
        ? 'Courier is assigned for delivery'
        : 'There are no more deliveries for today';
    res.send({ message, delivery: assignedDelivery });
  } else {
    res.status(404).send({ message: 'Delivery not found or assigned yet !!!' });
  }
});

export default deliveryRouter;
