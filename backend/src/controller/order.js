import { Router } from "express"
const router = Router()

import Product from "../models/Product.js"
import Order from "../models/Orders.js"
import User from "../models/Users.js"

export const checkout = async (req,res) => {
    const margedProducts = []   

    const cart = await Cart.aggregate([
        {$match: {userID: req.user.id}},
        {
            $lookup: {
                from: "products",
                localField: "products.productID",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        {
            $project: {
            userID: 1,
            products: { productID: 1,size: 1, color: 1, quantity: 1},
            productInfo: {
                productno: 1,
                _id: 1,
                price: 1,
                title: 1,
                img: 1
            }
            }
        },
    ]);

    const [cartt] = cart;//removing array brackets

    if(!cartt) res.status(404).json({message: "no products found on your cart"})
    
    cartt.products.forEach(product => { //murgind user cart product with db product info like price n all whic are dynamic
        const productInfo = cartt.productInfo.find(info => `${info._id}` === `${product.productID}`); //converted to string because when i was checking === it was cheecking the refrence on the memory not value bcz its an Objectid is an refrence ty[e]
        margedProducts.push({ ...product, ...productInfo });
    })
    
    //calculationg total price
    const price = await margedProducts.reduce((total, item) => total + (item.price * item.quantity),0)
 
    try {

      const dborder = await Order.create({ // Saving to db
        userID: req.user.id,
        products: margedProducts,
        price: Number(price.toFixed(2)),
        agent: req.body.agent,
        order: response,
      })

      const updateProduct = dborder.products.map(product => ({
        updateOne: {
          filter: {_id : product.id},
          update: {
            $inc: { purchasedCount: product.quantity, quantity : -product.quantity }
          }
        }
      }))
      await Product.bulkWrite(updateProduct)
      

      await User.updateOne({_id: dborder.userID}, {$addToSet: { purchasedProducts : { $each : dborder.products.map(p => p._id)}}}) // map used to get only id's of product which are available on order 
      await Cart.deleteOne({userID: dborder.userID})   

      res.json({ order:{ id: response.id, amount: response.amount } })
    } catch (error) {
      console.log(error)
    }
}


