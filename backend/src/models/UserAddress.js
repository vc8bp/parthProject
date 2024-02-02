import mongoose from "mongoose"
import User from "./Users.js"

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true, 
    },
    street: {
        type: String, 
        required: [true, "street cannot be empty!"]
    },
    city: {
        type: String, 
        required: [true, "City cannot be empty!"]
    },
    state: {
        type: String, 
        required: [true, "State cannot be empty!"]
    },
    zip: {
        type: String, 
        required: [true, "Zip cannot be empty!"]
    },
    country: {
        type: String, 
        required: [true, "Country cannot be empty!"]
    },
})

AddressSchema.pre('save', async function (next) {
    const user = await User.findById(this.user);
    if (user) {
        user.address = new mongoose.Types.ObjectId(this._id);
        await user.save();
        next();
    }
});

const Address = mongoose.model("address", AddressSchema)
export default Address