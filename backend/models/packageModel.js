import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, uniquie: true },
    size: { type: String }, 
    cost: { type: Number },
  },
  {
    tymestamps: true,
  },
);

const packageModel = mongoose.model('Package', packageSchema);

export default packageModel;
