import ApiError from "../utils/Apierror"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import { User } from "../models/usermodel"

export const verifyJWT= asyncHandler(async(req, res,next)=>{
   try {
     const token=req.cookies?.accessToken || req.header(
         "Authorization"
     )?.replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
 
    const decodedtoken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user=await User.findById(decodedtoken?._id)
     .select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401,"invalid access token")
     }
 
     req.user=user;
     next()
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token")
   }

})