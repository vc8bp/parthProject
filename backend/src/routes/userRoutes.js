import { Router } from "express"
import { register, getAllEmployee, createOrUpdateAddress, updateProfile, changeProfile } from "../controller/user.js"
import { verifyAdmin, verifyToken } from "../middlewares/verifyToekn.js";


const route = Router()

route.post("/create" ,register)
route.get("/", verifyAdmin, getAllEmployee)
route.post("/address", verifyToken, createOrUpdateAddress)
route.put("/", verifyToken ,updateProfile)



//profile
route.post("/profile", verifyToken,  changeProfile)

export default route;