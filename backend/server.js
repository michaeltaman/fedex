import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';
import bodyParser from 'body-parser';
import userRouter from './routers/userRouter.js';
import deliveryRouter from './routers/deliveryRouter.js'


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.MONGODB_URL , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use('/api/users', userRouter);
app.use('api/delivery', deliveryRouter);
app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.use((err, req, res) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
