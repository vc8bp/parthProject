import { Router } from "express"
import { addProduct, getProductInfo, getProducts } from "../controller/products.js"

const route = Router()

route.post("/", addProduct)
route.get("/", getProducts )
route.get("/info/:id", getProductInfo )




export default route;