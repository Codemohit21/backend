import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    console.log("✅ File uploaded:", response.secure_url);

    // Delete file only if it exists
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);

    return response;

  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);

    // Delete file only if it exists
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);

    return null;
  }
};

export default uploadCloudinary;
