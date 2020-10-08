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
  const deliveries = await Delivery.find({});
  if (deliveries) {
    res.send(deliveries);
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
  //console.log("courierId: " ,req.user._id)
  if (moment(query.date, 'DD/MM/YYYY', true).isValid()) {
    const deliveries = await Delivery.find({ courierId: req.user._id, assignedAt: query.date });
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
