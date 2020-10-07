import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Package from '../models/packageModel.js';

const packageRouter = express.Router();

packageRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const packages = await Package.find({});
    res.send(packages);
  })
);

packageRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
     await Package.remove({});
    const createdPackages = await Package.insertMany(data.packages);
    res.send({ createdPackages });
  })
);

packageRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const pack = await Package.findById(req.params.id);
    if (pack) {
      res.send(pack);
    } else {
      res.status(404).send({ message: 'Package Not Found' });
    }
  })
);

export default packageRouter;