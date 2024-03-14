import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import uploadCloudinary from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// export const registerUSer = asyncHandler(async (req,res)=>{
//     res.status(200).json({
//         message:"ok"
//     })
// })

export const registerUSer = asyncHandler(async (req,res)=>{
    const {fullName,email,username,password}=req.body

    // if(fullName===""){
    //     throw new ApiError(400,"fullName is required")
    // }

    if(
    [fullName,email,username,password].some((obj)=> obj.trim()==="" )){
        throw new ApiError(400,"all mandatory field required");
    }

    //check existingUser
    const  existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"user with email or username already exists");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path||"";


    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }

    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }

    const user = await User.create({
        fullName,avatar:avatar.url,
        coverImage: coverImage?.url||"",
        email,password,
        username:username.toLowerCase()
    })

    //check entry in DB

    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"failed to register new user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

})
