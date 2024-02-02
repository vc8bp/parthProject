import { Router } from "express"
import authRoute from "./autRoute.js"
import userRoute from "./userRoutes.js"
import productRoutes from "./productRoutes.js"

const route = Router()

route.use("/auth", authRoute)
route.use("/user", userRoute)
route.use("/product", productRoutes)



export default route;