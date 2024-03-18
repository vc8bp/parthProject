import { isValidBody } from "../utils/bodyValidator.js";
import User from "../models/Users.js"
import { createHash } from "../utils/password.js";
import env from "dotenv"
import { Mongoose, connections } from "mongoose";
import Address from "../models/UserAddress.js";
import mongoose from "mongoose"
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadWithResize } from "../utils/compressImage.js";

env.config()

export const register = async (req, res) => {
    console.log("Hello world")
    const userType = req.user.type
    console.log(userType)
    if(!isValidBody(req, res, ["firstName", "lastName", "email", "number", "password", "role"])) return

    if (req.body.password.length < 5 || req.body.password.length > 16 ) {
        return res.status(400).json({sucess: false,message: "password length should be in range of 5 to 16 charecter"})
    };

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      number: req.body.number,
      password: createHash(req.body.password),
      role: req.body.role,
      type: req.body.type
    });
    
    try {
      const saveduser = await newUser.save();
      return res.status(201).json({res: saveduser, success: true, message: `An account for salesman with the email ${req.body.email} has been successfully created.`}); 
      
    } catch (err) {
        if(err.code === 11000) { 
          return res.status(400).json({sucess: false,message: "account with this email already exist"}) 
        } else if (err.name === "ValidationError") {
            for (let field in err.errors) {
              return res.status(400).json({sucess: false,message: err.errors[field].message}); 
            }
        } else {
          console.log(`Logged Error from register user : ${err}`)
          return res.status(500).json({sucess: false,message: "internal server error"})
        }
    }
}

export const getAllEmployee = async (req, res) => {
  const privateFileds = {password: 0, mfa: 0, otp: 0, otpExpire: 0, resetPasswordToken: 0, resetPasswordExpire: 0}
  const { id, s: qs } = req.query
  
  const filter = {}

  try {
    if(id){
      if(!mongoose.isValidObjectId(id)) return res.status(400).json({message: "User with this id didn't found!!"})
      const defaultDontWantFields = {"_id": 0, "user": 0, "__v": 0}
      const user = await User.findOne( {_id: new mongoose.Types.ObjectId(id) }, privateFileds).populate("address", defaultDontWantFields)

      //if(!userRoles[userType].includes(user.type)) return res.status(403).json({message: "You are not allowed to acces this profile"})
      // await user.populate("address", { __v: 0, _id: 0, user: 0 }).execPopulate();
      if(!user) return res.status(403).json({message: "You are not allowed to acces this profile"})

      await new Promise((reject, resolve) => {
        setTimeout(() => {
          return res.status(200).json(user)    
        }, 3000);
      })
      // return res.status(200).json(user)    
      
    }

    if(qs){
      filter["$or"] = [
        {"firstName": {$regex: qs, $options: "i"}},
        {"lastName": {$regex: qs, $options: "i"}},
        {"email": {$regex: qs, $options: "i"}},
        {"type": {$regex: qs, $options: "i"}},
        {"role": {$regex: qs, $options: "i"}},
      ]
    }

    const employees = await User.find(filter, privateFileds)
    res.status(200).json(employees)
  } catch (error) {
    console.log(error)
    return res.status(500).json({sucess: false,message: "internal server error"})
  }
}

//add or update address
export const createOrUpdateAddress = async (req, res) => {

  try {
    let idToUpdate = req.body._id ? req.body._id : req.user.id;
    
    const existingAddress = await Address.findOne({ user: new mongoose.Types.ObjectId(idToUpdate) })
    console.log(idToUpdate)

    let updatedAddress;

    if(existingAddress){
      updatedAddress = await Address.findOneAndUpdate(
        { user : idToUpdate },
        { $set: req.body },
        { new: true }
      )
    } else {
      updatedAddress = await Address.create({ ...req.body, user: idToUpdate });
    }
    const {__v, user, _id , ...other} = updatedAddress._doc;
    res.status(200).json({res: other, message: `Address ${updatedAddress ? "Updated" : "Added"} Successfully!!!`})
  } catch (error) {
    console.log(error)
    let message = "Failed to Update Address!!"
    if(error.name === "ValidationError"){
      message = Object.values(error.errors)[0].message
    }
    return res.status(500).json({success: false, message})
  }
}

export const updateProfile = async (req, res) => { 
  try {
    if(req.body.password){
      if(req.body._id) return res.status(404).json({message: "You are not allowed to update other's password"})
      const user = await User.findById(req.user.id, {password: 1})
      if(!user) return res.status(404).json({message: "User not found"})

      if(createHash(req.body.currentPass) !== user.password) return res.status(403).json({message: "Invalid current password"})
      user.password = createHash(req.body.password)
      await user.save()
      return res.status(200).json({message: "Password updated successfully"})
    }

    let idToUpdate = req.body._id ? req.body._id : req.user.id;

    const user = await User.findByIdAndUpdate(idToUpdate, { $set: req.body }, { new: true, fields: { firstName: 1, lastName: 1, email: 1, number: 1 } });

    if (!user) return res.status(404).json({ message: "User not found" });
    
    return res.status(200).json({message: "Profile updated successfully", res: user})

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to update user" });
  }
}


export const changeProfile = async (req, res) => {
  try {
    if (!req.body.avatar) return res.status(400).json({ error: 'Please upload a Image' });
  
    const avatarFile = req.body.avatar;
    const userId = req.user.id;
    
    const [metaD, mainDataString] = avatarFile.split(",")
 
    const imgName = await uploadWithResize(mainDataString, "static/avatar/", `avatar-${userId}`)

    await User.findByIdAndUpdate( userId, { avatar: imgName }, { new: true } );

    res.status(200).json({res: imgName, message: "profile updated Successfully"})
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "failed to Change Profile" });
  }
}


