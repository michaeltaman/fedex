import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import data from '../data.js';
import Delivery from '../models/deliveryModel.js';
import Courier from '../models/courierModel.js';
import { isSender } from '../utils.js';

const deliveryRouter = express.Router();

deliveryRouter.get(
  '/seed',
  isSender,
  expressAsyncHandler(async (req, res) => {
    await Delivery.deleteMany({}); //because using of ObjectId reference
    const createdDeliveries = await Delivery.insertMany(data.deliveries);
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
  if (delivery) {
    console.log('*** S E N D E R ***', req.user);

    delivery.sender = {
      name: req.user.name,
      email: req.user.email,
      senderId: req.user._id,
    };
    delivery.senderId = req.user._id;

    const couriers = await Courier.find({});
    console.log('*** couriers ***', couriers);

    const requiredVehicleType =
      delivery.deliveryItems[0].size === 'small' || delivery.deliveryItems[0].size === 'middle'
        ? 'sedan'
        : 'track';

    console.log('requiredVehicleType :', requiredVehicleType);

    const promises = couriers.map(async (courier) => {
      const courierDeliveries = await Delivery.find({ courierId: courier.id });

      if (courierDeliveries.length < 5 && courier.vehicleType === requiredVehicleType) {
        delivery.courier = {
          name: courier.firstName + ' ' + courier.lastName,
          phoneNumber: courier.phoneNumber,
          vehicleType: courier.vehicleType,
          courierId: courier._id,
        };
        delivery.courierId = courier.id;
        console.log('delivery.courierId :', delivery.courierId);
      }

      console.log('Chosen courier :', delivery.courier);

      return;
    });

    await Promise.all(promises);

    console.log('DELIVERY', delivery);

    const assignedDelivery = await delivery.save();
    res.send({ message: 'Courier is assigned for delivery', delivery: assignedDelivery });
  } else {
    res.status(404).send({ message: 'Delivery not found.' });
  }
});

export default deliveryRouter;
