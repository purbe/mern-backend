import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const skip = (page - 1) * limit;

    const videoComments= await Comment.find({video:videoId}).skip(skip)

    res.status(200).json(new ApiResponse(200,videoComments,"fetched video comment"))


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content,userId} = req.body

    const comment= await Comment.create({
        content,videoId,owner:userId
    })

    const commentInDb = await Comment.findById(comment._id)
    if(!commentInDb){
        throw new ApiError(500,"failed to add comment in DB")
    }

    res.status(200).json(
        new ApiResponse(201,comment._id,"added comment")
    )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body

    const updateComment=await Comment.findByIdAndUpdate({_id:commentId},{content:content},{new:true}).select("-owner -video")

    res.status(200).json(
        new ApiResponse(
            204,
            updateComment,
            "comment updated"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {videoId} = req.params

    await Comment.findOneAndDelete(req.comment._id)

    res.status(200).json(new ApiResponse(200,null,"deleted"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}