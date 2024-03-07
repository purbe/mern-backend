import {asyncHandler} from "../utils/asyncHandler.js";


export const registerUSer = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})