import { Router } from "express"
import { checkout } from "../controller/order.js"
import { verifyToken } from "../middlewares/verifyToekn.js"

const route = Router()

route.post("/", verifyToken , checkout)

export default route;