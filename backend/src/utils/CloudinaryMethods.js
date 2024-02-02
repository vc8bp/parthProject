import { v2 as cloudinary } from "cloudinary"
import { config } from "dotenv"
config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadImageToCloudinary = async (image, name) => {
  console.log("me runed")
  try {
    const result = await cloudinary.uploader.upload(image, {
      public_id: name
    });
    
    return {
      success: true,
      url: result.secure_url
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

export const deleteImageFromCloudinary = async (name) => {
  try {
    const result = await cloudinary.uploader.destroy(name)
    console.log(result)
    return {success: true}
  } catch (error) {
    console.log(error)
    return {success: false, error: error}
  }
}






