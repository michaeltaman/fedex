import jwt from 'jsonwebtoken';
import config from './config.js';
const getToken = (user) => {
  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.role,
  }, config.JWT_SECRET,
  {
    expiresIn: '30d',
  })
}

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ msg: 'Invalid Token' });
      }
      req.user = decode;
      next();
      return
    });
  } else {
    return res.status(401).send({ msg: "Token is not supplied." });
  }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ msg: 'Admin Token is not valid.' })
}

const isSender = (req, res, next) => {
  console.log(req.user.isSender)
  if (req.user && req.user.role === 'sender') {
    return next();
  }
  return res.status(401).send({ msg: 'Sender Token is not valid.' })
}

const isCourier = (req, res, next) => {
  console.log(req.user.isSender)
  if (req.user && req.user.role === 'courier') {
    return next();
  }
  return res.status(401).send({ msg: 'Courier Token is not valid.' })
}


export {
  getToken, isAuth, isAdmin, isSender, isCourier
}