import mongoose from 'mongoose';


const packageSchema = new mongoose.Schema({
  size: { type: String, required: true },
  cost: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
});

const packageModel = mongoose.model("Package", packageSchema);

export default packageModel;