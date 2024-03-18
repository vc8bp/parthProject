import mongoose from "mongoose"

const CartSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  products: [
      {
          productID: {type: mongoose.Types.ObjectId},
          quantity: {type: Number},
      }
  ]   
  },{timestamps: true}
); 
 

const Cart = mongoose.model('Cart', CartSchema)
export default Cart