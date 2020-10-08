import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import data from '../data.js';
import data1 from '../data-1.js';

import Delivery from '../models/deliveryModel.js';
import Courier from '../models/courierModel.js';
import { isSender } from '../utils.js';

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


deliveryRouter.get('/mine', isSender, async (req, res) => {
  const deliveries = await Delivery.find({ senderId: req.user._id });
  if (deliveries) {
    res.send(deliveries);
  }
});

deliveryRouter.post('/:id', isSender, async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);
  /////console.log("Does Assigned: ", delivery.courierId)
  if (delivery /*&& !delivery.courierId*/) {
    //console.log('*** S E N D E R ***', req.user);

    delivery.sender = {
      name: req.user.name,
      email: req.user.email,
      senderId: req.user._id,
    };
    delivery.senderId = req.user._id;

    const couriers = await Courier.find({});
    //console.log('*** couriers ***', couriers);

    const requiredVehicleType =
      delivery.deliveryItems[0].size === 'small' || delivery.deliveryItems[0].size === 'middle'
        ? 'sedan'
        : 'track';

    //console.log('requiredVehicleType :', requiredVehicleType);

    const promises = couriers.map(async (courier) => {
      const courierDeliveries = await Delivery.find({ courierId: courier.id, assignedAt: getCurrentDate() });

      console.log('courierDeliveries: ', courierDeliveries);

      if (courierDeliveries.length < 5 && courier.vehicleType === requiredVehicleType) {
        delivery.courier = {
          name: courier.firstName + ' ' + courier.lastName, 
          vehicleType: courier.vehicleType,
          courierId: courier._id,
        };
        delivery.courierId = courier.id;
        delivery.assignedAt = getCurrentDate();
        //console.log('delivery.courierId :', delivery.courierId);
      }

      //console.log('Chosen courier :', delivery.courier);

      return;
    });

    await Promise.all(promises);

    //console.log('DELIVERY', delivery);

    const assignedDelivery = await delivery.save();

    console.log('$$$$$$$$$$$$$$$$$ ', assignedDelivery);
    const message = assignedDelivery.assignedAt === getCurrentDate() ? 'Courier is assigned for delivery' : 'There are no more deliveries for today'
    console.log(message);
    res.send({ message, delivery: assignedDelivery });
  } else {
    res.status(404).send({ message: 'Delivery not found or assigned yet.' });
  }
});

export default deliveryRouter;
