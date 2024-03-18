import { Router } from "express"
import { register, getAllEmployee, createOrUpdateAddress, updateProfile, changeProfile } from "../controller/user.js"
import { verifyAdmin, verifyToken } from "../middlewares/verifyToekn.js";


const route = Router()

route.post("/create", verifyAdmin, register)
route.get("/", verifyAdmin, getAllEmployee)
route.post("/address", verifyAdmin, createOrUpdateAddress)
route.put("/", verifyAdmin, updateProfile)



//profile
route.post("/profile", verifyAdmin,  changeProfile)

export default route;