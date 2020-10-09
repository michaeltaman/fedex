import bson from 'bson-objectid';

const data2 = {
  deliveries: [
    {
      description: 'Delivery-8',
      shippingCost: 30,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L1',
          size: 'small',
          cost: 320,
          packageId: bson('5f7dbcfd0fa65f0ed88dfeea'),
        },
      ],
    },
    {
      description: 'Delivery-9',
      shippingCost: 60,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L2',
          size: 'small',
          cost: 750,
          packageId: bson('5f7dbcfd0fa65f0ed88dfeeb'),
        },
      ],
    },
    {
      description: 'Delivery-10',
      shippingCost: 40,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L3',
          size: 'small',
          cost: 500,
          packageId: bson('5f7dbcfd0fa65f0ed88dfeec'),
        },
      ],
    },
    {
      description: 'Delivery-11',
      shippingCost: 45,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L4',
          size: 'small',
          cost: 600,
          packageId: bson('5f7dbcfd0fa65f0ed88dfeed'),
        },
      ],
    },
    {
      description: 'Delivery-12',
      shippingCost: 70,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L5',
          size: 'small',
          cost: 1100,
          packageId: bson('5f7dbcfd0fa65f0ed88ffeee'),
        },
      ],
    },
    {
      description: 'Delivery-13',
      shippingCost: 50,
      sender: {},
      courier: {},
      deliveryItems: [
        {
          name: 'Package-L6',
          size: 'small',
          cost: 300,
          packageId: bson('5f7dbcfd0fa65f0ed88feeee'),
        },
      ],
    },
  ],
};

export default data2;