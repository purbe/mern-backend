import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {Video} from "../models/video.model.js";
import uploadCloudinary from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {isValidObjectId} from "mongoose";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // Calculate skip value for pagination
    // Constructing the sort options based on parameters
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortType === 'desc' ? -1 : 1;
    }
    const skip = (page - 1) * limit;
    if (userId) {
        query.owner = userId;
    }
    const allVideo=  await Video.find(query).sort(sortOptions).skip(skip).limit(limit)
    // Convert cursor to array of documents
    const videos = await allVideo.toArray();

    // Output the results
    console.log(videos);
    return res.status(200).json(
        new ApiResponse(
            200,videos,
            "fetch all video"
        )
    )
})
const publishAVideo = asyncHandler(async (req,res)=> {
    const{title,description} = req.body

    const videoLocalPath=req.files?.videoFile?.[0]?.path ||"";
    const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path ||"";

    if(!videoLocalPath){
        throw new ApiError(400,"video file is required");
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail file is required");
    }

    const videoFile = await uploadCloudinary(videoLocalPath);
    const thumbnailFile = await uploadCloudinary(thumbnailLocalPath);

    const video = await Video.create({

            title,description,
            videoFile:videoFile.url,
            thumbnailFile:thumbnailFile.url,
            duration:videoFile.bytes, //need to check
            isPublished:true,
            owner:req.user?._id

    }
    )

    //check in DB
    const publishVideo = await Video.findById(video._id)

    if(!publishVideo){
        throw new ApiError(500,"failed to publish a video");
    }

    return res.status(201).json(
        new ApiResponse(200,publishVideo,"publish a video successfully")
    )


})

const getVideoById= asyncHandler(async (req,res)=>{
    const {videoId}= req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"videoId is not valid")
    }

    const video = await Video.findById(videoId);

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "fetched video successfully"
        )
    )

})

const updateVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params

    const updateVideoDetail =await Video.findByIdAndUpdate(videoId,
        {
             $set:{
                 title:req.title,
                description:req.description,
                thumbnail:req.thumbnail
            }
            },
    {
        new : true
    }
    )

    return res.status(200).json(
        new ApiResponse(200,updateVideoDetail,"video detail updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req,res)=>{
    const {videoId}= req.params

    const deletevideo = await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "video is deleted Successfully"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res)=> {
    const {videoId} = req.params

    const video = await Video.findById(videoId)
    if(video.isPublished)
    {
        Video.findByIdAndUpdate(videoId,{
            $set:{
                isPublished:false
            }
        })
    }
    else {
        Video.findByIdAndUpdate(videoId,{
            $set:{
                isPublished:true
            }
        })
    }

    return res.status(200).json(200,{},"changed published status successfully")
})

export {
    publishAVideo,
    deleteVideo,
    togglePublishStatus,updateVideo,
    getVideoById
}

