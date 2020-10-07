import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Courier from '../models/courierModel.js';
import { isAuth, isAdmin } from '../utils.js';

const courierRouter = express.Router();

courierRouter.get(
    '/seed',
     isAuth,
     isAdmin,
    expressAsyncHandler(async (req, res) => {
      await Courier.deleteMany({}); //because using of ObjectId reference
      const createdUsers = await Courier.insertMany(data.couriers);
      res.send({ createdUsers });
    })
  );
  

export default courierRouter;