import mongoose from 'mongoose';

/*
const deliveryItemsSchema = new mongoose.Schema({
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  name: {type: String},
  size: {type: String},
  cost: {type: Number},
});*/

const deliverySchema = new mongoose.Schema(
  {
    description: { type: String },
    shippingCost: { type: Number},
    // sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Sender' },
    // courier: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier' },
    //deliveryItems: [deliveryItemsSchema],
    //deliveryAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const deliveryModel = mongoose.model('Delivery', deliverySchema);
export default deliveryModel;
