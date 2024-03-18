import { Router } from "express"
import { getAgents, addAgent } from "../controller/agent.js"
import { verifyToken } from "../middlewares/verifyToekn.js"

const route = Router()

route.get("/", verifyToken , getAgents)
route.post("/", verifyToken , addAgent)

export default route;