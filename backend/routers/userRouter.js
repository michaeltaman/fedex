import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { getToken, isAuth, isAdmin } from '../utils.js';

const userRouter = express.Router();

//http://localhost:5000/api/users/seed - create first users from the data - file
userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({ email: req.body.email });
    if (signinUser) {
      if (bcrypt.compareSync(req.body.password, signinUser.password)) {
        res.send({
          _id: signinUser._id,
          name: signinUser.name,
          email: signinUser.email,
          role: signinUser.role,
          token: getToken(signinUser),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post('/register', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ msg: 'Invalid User Data.' });
  }
});

userRouter.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'Arcady',
      email: 'admin-2@example.com',
      password: bcrypt.hashSync('1234', 8), 
      isAdmin: true,
    });

    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

userRouter.put('/:id', isAuth, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId); // verify the user id  !!!
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = bcrypt.hashSync(req.body.password,8) || user.password;    //bcrypt.hashSync('1234', 8),
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.role,  
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found.' });
  }
});

export default userRouter;
