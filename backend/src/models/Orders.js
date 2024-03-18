const mongoose = require('mongoose');
const { Schema } = mongoose;

  const OrderSchema = new Schema({
 
    userID: { type: String, required: true },
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
    userInfo: {
      address: {type: Object, required: true},
      name: {type: String, required: true},
      email: {type: String, required: true},
    },   
    order: {type: Object, required: true},
    paymentStatus: {type: Boolean, default: false}
  },{timestamps: true}
  );



module.exports = mongoose.model('Order',OrderSchema);
  