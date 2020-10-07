import mongoose from 'mongoose';


const courierSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },

});

const courierModel = mongoose.model("Courier", courierSchema);

export default courierModel;