import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Subscription} from "../models/subscription.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const existedVideo = await Like.findOne({video:videoId,likedBy:req.user._id})

    if(existedVideo){
        await Like.deleteOne({video:videoId,likedBy:req.user._id});
        console.log(`Unliked by user ${req.user.id} from video ${videoId}`);
        res.status(200).json({ success: true, message: 'Unliked successfully' });
    } else {
        // If user is not subscribed, subscribe them
        await Like.insertOne({video:videoId,likedBy:req.user._id});
        console.log(`liked by user ${req.user.id} to video ${videoId}`);
        res.status(200).json({ success: true, message: 'Liked successfully' });
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const existedComment = await Like.findOne({comment:commentId,likedBy:req.user._id})

    if(existedComment){
        await Like.deleteOne({comment:commentId,likedBy:req.user._id});
        console.log(`Unliked by user ${req.user.id} from comment ${commentId}`);
        res.status(200).json({ success: true, message: 'Unliked successfully' });
    } else {
        // If user is not subscribed, subscribe them
        await Like.insertOne({comment:commentId,likedBy:req.user._id});
        console.log(`liked by user ${req.user.id} to comment ${commentId}`);
        res.status(200).json({ success: true, message: 'Liked successfully' });
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
        const {tweetId} = req.params
        //TODO: toggle like on tweet
    const existedTweet = await Like.findOne({tweet:tweetId,likedBy:req.user._id})

    if(existedTweet){
        await Like.deleteOne({tweet:tweetId,likedBy:req.user._id});
        console.log(`Unliked by user ${req.user.id} from tweet ${tweetId}`);
        res.status(200).json({ success: true, message: 'Unliked successfully' });
    } else {
        // If user is not subscribed, subscribe them
        await Like.insertOne({tweet:tweetId,likedBy:req.user._id});
        console.log(`liked by user ${req.user.id} to tweet ${tweetId}`);
        res.status(200).json({ success: true, message: 'Liked successfully' });
    }

    }
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {userId} = req.params
    //Todo
    const allLikedVideos = await Like.find({likedBy:userId})

    res.status(200).json(
        new ApiResponse(
            200,
            allLikedVideos,
            "fetched all liked videos"
        )

    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}