import mongoose from 'mongoose';
import { Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is eequired"],
        minlength: [2, "frist name minimum length should be 2 char"],
    },
    lastName: {
        type: String,
        required: true,
        minlength: [2, "Last name minimum length should be 2 char"],
    },
    avatar: { type: String, required: false },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "this email is not valid email type"] 
    },
    number: { 
        type: Number, 
        required: [true, "Number is eequired"],
    },
    password: { type: String, required: [true, "Password is eequired"] },
    isAdmin: { type: Boolean, default: false},

    address: { type: Schema.Types.ObjectId, ref: 'address' },
    leaveBalance: {type: Number, default: 30},

    //2fa
    mfa: { type: Boolean, default: false},
    otp: Number,
    otpExpire: Date,

    //reset password things
    resetPasswordToken: String,
    resetPasswordExpire: Date,

},{timestamps: true});


const User = mongoose.model('user', UserSchema)
export default  User