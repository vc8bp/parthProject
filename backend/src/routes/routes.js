import { Router } from "express"
import authRoute from "./autRoute.js"
import userRoute from "./userRoutes.js"
import productRoutes from "./productRoutes.js"
import cartRoutes from "./CartRoutes.js"
import agentRoute from "./agentRoute.js"

const route = Router()

route.use("/auth", authRoute)
route.use("/user", userRoute)
route.use("/product", productRoutes)
route.use("/cart", cartRoutes)
route.use("/agent", agentRoute)


export default route;