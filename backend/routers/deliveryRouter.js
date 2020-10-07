import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Delivery from '../models/deliveryModel.js';
import { isSender } from '../utils.js';

const deliveryRouter = express.Router();

deliveryRouter.get(
    '/seed',
    isSender,
    expressAsyncHandler(async (req, res) => {
      await Delivery.deleteMany({}); //because using of ObjectId reference
      const createdDeliveries = await Delivery.insertMany(data.deliveries);
      res.send({ createdDeliveries });
    })
  );


export default deliveryRouter;