import mongoose from 'mongoose';


const deliveryItemsSchema = new mongoose.Schema({
  name: {type: String},
  size: {type: String},
  cost: {type: Number},
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
});

const deliverySchema = new mongoose.Schema(
  {
    description: { type: String },
    shippingCost: { type: Number},
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Sender', required: true },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', required: true },
    deliveryItems: [deliveryItemsSchema],
    deliveryAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const deliveryModel = mongoose.model('Delivery', deliverySchema);
export default deliveryModel;
