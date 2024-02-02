import crypto from "crypto"
import env from "dotenv"
import jwt from "jsonwebtoken"

env.config()

const salt = process.env.SALT

export const createHash = (password, withSault = true) => {
    const hash = crypto.createHash('sha256')
    const finalString = withSault ? `${password}${salt}` : password
    return hash.update(finalString).digest("hex")
}

export const createJWT = (data) => {
    return jwt.sign(data, process.env.JWT_TOKEN_SECRATE, { expiresIn: "10s"})
}
export const createJWTRefresh = (data) => {
    return jwt.sign(data, process.env.JWT_REFRESH_SECRATE, { expiresIn: "7d"})
}