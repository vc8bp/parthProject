import { Router } from "express"
import { addProduct, getProducts } from "../controller/products.js"

const route = Router()

route.post("/", addProduct)
route.get("/", getProducts )



export default route;