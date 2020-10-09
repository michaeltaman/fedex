import mongoose from 'mongoose';


const deliveryItemsSchema = new mongoose.Schema({
  name: {type: String},
  size: {type: String},
  cost: {type: Number},
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
});

const deliveryCourier = new mongoose.Schema({
  name: {type: String},
  phoneNumber: { type: String},
  vehicleType: { type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier'},
});

const deliverySender = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sender'},
});

const deliverySchema = new mongoose.Schema(
  {
    description: { type: String },
    shippingCost: { type: Number},
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    courierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sender:  [ deliverySender ],
    courier: [ deliveryCourier ],
    deliveryItems: [deliveryItemsSchema],
    assignedAt: { type: String },
    assignedAtISO: { type: Date },
  },
  {
    timestamps: true,
  },
);

const deliveryModel = mongoose.model('Delivery', deliverySchema);
export default deliveryModel;
