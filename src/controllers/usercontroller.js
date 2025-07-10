import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from '../utils/Apierror.js';
import validator from "validator";
import {User} from '../models/usermodel.js';
import uploadCloudinary from "../utils/"


///get user details from frontend

// validation - not empty

// check if user already exists: username, email

// check for images, check for avatar

// upload them to cloudinary, avatar

// create user object - create entry in db

// remove password and refresh token field from response

// check for user creation

// return
//valdate format of email
// import validator from "validator";

// if (!validator.isEmail(email)) {
//   throw new ApiError(400, "Invalid email format");
// }

const registerUser = asyncHandler(
    async (req, res) => {

        const { fullname, email, username, password } = req.body;

        if (!fullname || !email || !username || !password) {
            throw new ApiError(400, "All fields are required");
        }

        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Invalid email format");
        }

       const existeduser=await User.findOne({
            $or :[{username},{email}]
        })

        if(existeduser){
            throw new ApiError(409,"user existed");
        }

        const avatarlocalpath= req.files?.avatar[0]?.path
        const coverimagelocalpath= req.files?.coverimage[0]?.path

        if(!avatarlocalpath){
            throw new ApiError(400,"avatar file is required");
        }



    }
)

export { registerUser }