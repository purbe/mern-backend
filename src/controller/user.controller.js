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

const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }catch (error){
        throw new ApiError(500,"someting went wromg while genereating refresh to")
    }
}

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

    const avatarLocalPath=req.files?.avatar?.[0]?.path ||"";
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

export const loginUser = asyncHandler(async (req,res)=>{

    const {username,email,password} = req.body;
    console.log(`email ${email} ${username}`);
    if(!username && !email){
        throw new ApiError(400,"username and email required");
    }

    const User = await User.findOne({
        $or:[{username},{email}]
    })

    if(!User){
        throw new ApiError(409,"user does not exist");
    }

    const validatePassword = await User.isPasswordCorrect(password);

    if(!validatePassword){
        throw  new ApiError(400,"invalid credential ")
    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    //cookie only be modified by server
    const options = {
        httpOnly: true,
        secure:true
    }

    return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(200,{
                user:loggedUser,
                accessToken,
                refreshToken
            },"user logged in successfully")
        )
})

export const logoutUser = asyncHandler(async (req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
        new : true
        }
        )

    const options = {
        httpOnly: true,
        secure:true
    }

    return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{},"user logged out"))
})