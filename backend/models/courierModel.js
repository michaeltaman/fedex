import mongoose from 'mongoose';


const courierSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },

});

const courierModel = mongoose.model("Courier", courierSchema);

export default courierModel;