import { Router } from "express"
import { getUserCart, getCartSize, UpdateProductQty, deleteProduct, addToCart } from "../controller/cart.js"
import { verifyToken } from "../middlewares/verifyToekn.js"

const route = Router()

route.get("/", verifyToken , getUserCart)
route.post("/", verifyToken , addToCart)
route.get("/size",verifyToken ,getCartSize)
route.put("/updatequantity/:productNumber/:newQuantity", verifyToken ,UpdateProductQty)
route.delete("/:id", verifyToken ,deleteProduct)

export default route;