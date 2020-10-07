import mongoose from 'mongoose';

const deliveryPackageSchema = new mongoose.Schema({
  description: { type: String, required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
});

const deliverySchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Sender', required: true },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', required: true },
    deliveryPackage: [deliveryPackageSchema],
    deliveryAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const deliveryModel = mongoose.model('Delivery', deliverySchema);
export default deliveryModel;
