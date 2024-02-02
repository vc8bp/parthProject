import crypto from "crypto"
import jwt from "jsonwebtoken"
import { isValidBody } from "../utils/bodyValidator.js";
import User from "../models/Users.js"
import { createHash, createJWT, createJWTRefresh } from "../utils/password.js";
import env from "dotenv"
import { createResetEmailHTML } from "../utils/email/resetEmail.js";
import { sendEmail } from "../utils/email/sendEmail.js";
env.config()

const refreshCookieOptions = {
  // httpOnly: true,
  // secure: true,
  // sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000
}

export const login = async (req, res) => {
    if(!req.body.email || !req.body.password) {
      return res.status(400).json({sucess: false,message: "please provide email and password"})
    }
    const cookie = req.cookies.token;
    const defaultDontWantFields =  {__v: 0,_id: 0,user: 0}
    try {
        const user = await User.findOne({email: req.body.email}).populate("address", defaultDontWantFields)
        if (!user) {
          return res.status(404).json({sucess: false,message: "user with this email dosent exist"})
        } 
  
        //matching pass
        const pass = createHash(req.body.password)
        if(user.password !== pass) {
          return res.status(403).json({sucess: false,message: "Incorrect password. Please double-check your password and try again."}) 
        }

        console.log(user)
        
        const accessToken = createJWT({id:user._id, isAdmin: user.isAdmin})
        const refreshToken = createJWTRefresh({id: user._id})

        res.cookie("token", refreshToken, refreshCookieOptions)
        
        const {password,resetPasswordToken,resetPasswordExpire, ...others} = user._doc
        others["accessToken"] = accessToken
        res.status(200).json(others)
      
    } catch (err) {
      console.log(err)
      return res.status(500).json({ sucess: false,message: "Internal server error" });   
    }
}

export const refresh = async (req, res) => {
  const token = req.cookies?.token;
  if(!token) return res.status(403).json({success: false, message: "Unauthorized!! please login."})
  try {
    const ress = jwt.verify(token, process.env.JWT_REFRESH_SECRATE)
    const user = await User.findById(ress.id);
    if(!user) return res.status(404).json({success: false, message: "Session with this user doesn't found"})
    const accessToekn = createJWT({id: user._id, isAdmin: user.isAdmin})
    res.json(accessToekn)
  } catch (error) {
    return res.status(404).json({success: false, message: "sesstion is Expired, Please login again."})
  }

} 


export const logout = async (req,res) => {
  const token = req.cookies?.token;
  if(!token) return res.status(204)
  res.clearCookie("token", refreshCookieOptions)
  res.status(200).json({success: true, message: "Logout Successfull"})
}

const resetPassMsg = "If a user with this email exists, we will send you an email with instructions to reset your password."
export const forgotPassword = async (req, res)=> {
  const {email , resetEndPoint} = req.body;
  if(!email) return res.status(400).json({sucess: false,message: "please provide a email"});

  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedresetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expireDate = Date.now() + (10 * 60000); // 10min
  

  try {
    const user = await User.findOne({email: email});

    if(!user) return res.status(200).json({sucess: false,message: resetPassMsg});  //returning succeess bcz we dont want user to know that no user exist with this email
  
    const frontendUrl = process.env.ALLOWED_HOST
    
    const emailtext = `
      you have requested a password reset
      please go tho this link to reset password
      ${frontendUrl}${resetEndPoint}${resetToken}
    `
    const emailTemplate = createResetEmailHTML(user.firstName, frontendUrl, resetEndPoint ,resetToken)

    try {
      await sendEmail({
        to: user.email,
        subject: "Forgot Password",
        emailhtml: emailTemplate,
        emailtext: emailtext
      })

      user.resetPasswordToken = hashedresetPasswordToken
      user.resetPasswordExpire = expireDate
      user.save()

      return res.status(200).json({sucess: true,message: resetPassMsg})

    } catch (error) {
      console.log(error)
      return res.status(401).json({sucess: false,message: "Failed to send email"})
    }

  } catch (error) {
    return res.status(500).json({message: "Internal server error"})
  }
}



export const resetPassword = async (req,res) => {
  const hashedresetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
  try {
    //validating if this token is valid or not
    const user = await User.findOne({
      resetPasswordToken: hashedresetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } 
    })
    if(!user) return res.status(400).json({ message: "Invalid token or the link may have expired."});
    
    
    //checking if user is entering his old password
    const newPassword = createHash(req.body.password);

    console.log(newPassword)
    console.log(user.password)
    if(user.password === newPassword) return res.status(401).json({message: "you can not add your current password"})
    
    
    //setting saving new password to db
    user.password = newPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({message: "password sucessfully changed"})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal server error"})
  }

}