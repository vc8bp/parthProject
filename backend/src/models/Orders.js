import mongoose from "mongoose"
const { Schema } = mongoose;

  const OrderSchema = new Schema({
    userID: { type: String, required: true },
    agent: {type: String, required: true},   
    products: [
        {
            title: {type: String},
            img: {type: String},
            price: {type: Number},
            productID: {type: String},
            quantity: {type: Number, default: 1},
            size: {type: String},
            color: {type: String}
        }
    ],
    price: {type: Number, required: true},
    order: {type: Object, required: true},
    paymentStatus: {type: Boolean, default: false}
  },{timestamps: true});

export default mongoose.model('Order',OrderSchema);
  