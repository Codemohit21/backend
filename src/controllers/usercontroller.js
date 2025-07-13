import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from '../utils/Apierror.js';
import validator from "validator";
import { User } from '../models/usermodel.js';
import uploadCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/Apiresponce.js";
import { trusted } from "mongoose";
import jwt from "jsonwebtoken";



const generateAccessTokenandrefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "oops something went wrong in token generation")
    }
}

const registerUser = asyncHandler(
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
    async (req, res) => {

        const { fullname, email, username, password } = req.body;

        if (!fullname || !email || !username || !password) {
            throw new ApiError(400, "All fields are required");
        }

        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        const existeduser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existeduser) {
            throw new ApiError(409, "user existed");
        }

        const avatarlocalpath = req.files?.avatar?.[0]?.path;
        const coverimagelocalpath = req.files?.coverimage?.[0]?.path;

        if (!avatarlocalpath) {
            throw new ApiError(400, "avatar file is required");
        }

        const avatar = await uploadCloudinary(avatarlocalpath);

        if (!avatar) {
            throw new ApiError(400, "avatar file is required");
        }

        let coverimage = null;
        if (coverimagelocalpath) {
            coverimage = await uploadCloudinary(coverimagelocalpath);
        }

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

        const createduser = await User.findById(user._id).select("-password -refreshToken")

        if (!createduser) {
            throw new ApiError(500, "something went wrong")
        }

        return res.status(201).json(
            new ApiResponse(200, createduser, "user register successfully")
        )




    }
)

const loginUser = asyncHandler(async (req, res) => {
    //req body->data
    //username
    //find the user
    //password check
    //generate access and refresh token
    //send cookie
    //succefully done

    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "user or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "user not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "password or email is wrong")
    }

    const { accessToken, refreshToken } = await generateAccessTokenandrefreshtoken(user._id)



    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user logged in"
            ))


})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }

        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.
        refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "refresh token is missing or invalid")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "refresh token is missing or invalid")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or invalid")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessTokenandrefreshtoken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token is refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }




})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}