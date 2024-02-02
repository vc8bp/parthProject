import { Router } from "express"
import { forgotPassword, login, logout, refresh, resetPassword } from "../controller/auth.js"

const route = Router()

route.post("/login", login)
route.get("/refresh", refresh)
route.get("/logout", logout)

route.post("/forgot-password", forgotPassword)
route.post("/reset-password/:resetToken", resetPassword)

export default route;