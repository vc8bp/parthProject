import express from "express"
import env from "dotenv"
import cors from "cors"
import connectTodb from "./utils/connectToDb.js"
import routes from "./routes/routes.js"
import cookieParser from "cookie-parser"
import path, { join, dirname } from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

env.config()


const app = express()


const whitelist = [ process.env.ALLOWED_HOST ]
console.log(whitelist) 
 
var corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))
app.use(express.json({limit: "5mb"}))
app.use(cookieParser());

connectTodb(process.env.MONGO_URI)


const port = process.env.PORT || 8000;


export const staticDir = join(dirname(__filename), '..', 'static');
app.use(express.static(staticDir))
app.use("/", routes)
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

