import bson from 'bson-objectid';

const data1 = {
  deliveries: [
    {
      description: 'Delivery-3',
      shippingCost: 180,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-AAA',
          size: 'big',
          cost: 810,
          packageId: bson('5f7dbcfd0fa65f0ed88dfaaa'),
        },
      ],
    },
    {
      description: 'Delivery-4',
      shippingCost: 280,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-BBB',
          size: 'big',
          cost: 7000,
          packageId: bson('5f7dbcfd0fa65f0ed88dfbbb'),
        },
      ],
    },
    {
      description: 'Delivery-5',
      shippingCost: 640,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-CCC',
          size: 'big',
          cost: 31000,
          packageId: bson('5f7dbcfd0fa65f0ed88dfccc'),
        },
      ],
    },
    {
      description: 'Delivery-6',
      shippingCost: 570,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-DDD',
          size: 'big',
          cost: 2000,
          packageId: bson('5f7dbcfd0fa65f0ed88dfddd'),
        },
      ],
    },
    {
      description: 'Delivery-7',
      shippingCost: 960,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-EEE',
          size: 'big',
          cost: 28000,
          packageId: bson('5f7dbcfd0fa65f0ed88dfeee'),
        },
      ],
    },
  ],
};

export default data1;