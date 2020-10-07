import bcrypt from 'bcryptjs';
import bson from 'bson-objectid';

const data = {
  users: [
    {
      name: 'Michael',
      email: 'admin-1@example.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
    },
    {
      name: 'ABC-Corporation-1 Ltd.',
      email: 'sender-1@example.com',
      password: bcrypt.hashSync('1234', 8),
      role: 'sender',
    },
    {
      name: 'John',
      email: 'courier-1@example.com',
      password: bcrypt.hashSync('1234', 8),
      role: 'courier',
    },
    {
      name: 'Pitter',
      email: 'courier-2@example.com',
      password: bcrypt.hashSync('1234', 8),
      role: 'courier',
    },
    {
      name: 'Marina',
      email: 'user-1@example.com',
      password: bcrypt.hashSync('1234', 8),
      role: 'customer',
    },
  ],
  packages: [
    {
      name: 'Package-1',
      size: 'small',
      cost: 120,
    },
    {
      name: 'Package-2',
      size: 'small',
      cost: 170,
    },
    {
      name: 'Package-3',
      size: 'middle',
      cost: 220,
    },
    {
      name: 'Package-4',
      size: 'big',
      cost: 410,
    },
    {
      name: 'Package-5',
      size: 'big',
      cost: 380,
    },
    {
      name: 'Package-6',
      size: 'middle',
      cost: 250,
    },
  ],
  couriers: [
    {
      user: bson('5f7db65a71921a2a2874efc1'),
      firstName: 'John',
      lastName: 'Brown',
      phoneNumber: '053745567',
      vehicleType: 'sedan',
    },
    {
      user: bson('5f7db65a71921a2a2874efc2'),
      firstName: 'Pitter',
      lastName: 'Pan',
      phoneNumber: '0586203124',
      vehicleType: 'track',
    }
  ]
};
export default data;
