import mongoose from 'mongoose';


const senderSchema = new mongoose.Schema({
  companyName: { type: String, required: true },

});

const senderModel = mongoose.model("Sender", senderSchema);

export default senderModel;