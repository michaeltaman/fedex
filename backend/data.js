import bcrypt from 'bcryptjs';

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
};
export default data;
