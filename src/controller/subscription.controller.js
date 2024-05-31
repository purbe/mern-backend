import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    //check if already subscribed then return unsubscribe
    //else return subscribe
    const existingSubscription = await Subscription.findOne({ subscriber: req.user._id, channel:channelId });

    if (existingSubscription) {
        // If user is already subscribed, unsubscribe them
        await Subscription.deleteOne({ subscriber: req.user.id, channel:channelId });
        console.log(`Unsubscribed user ${req.user.id} from channel ${channelId}`);
        res.status(200).json( new ApiResponse(
            200,
    "Unsubscribed successfully"
        ))
    } else {
        // If user is not subscribed, subscribe them
        await Subscription.insertOne({ subscriber: req.user.id, channel:channelId });
        console.log(`Subscribed user ${req.user.id} to channel ${channelId}`);
        res.status(200).json(new ApiResponse(
            200,
            "Subscribed successfully "))

    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // if(!channelId){
    //     throw new ApiError(400,"channel id is required")
    // }

    if(!isValidObjectId(channelId)){
        throw new ApiError(401,"channel is not valid")
    }

    const Channel = await Subscription.findById(channelId)
    console.log(Channel);
    if(!Channel){
        throw new ApiError(500, "failed to fetch channel")
    }

    return res.status(200)
        .json(new ApiResponse(
            200,Channel.channel,"channel fetched successfully")
        )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(401,"subscribed id is not valid")
    }

    const subscribedChannel = await Subscription.findById(subscriberId)
    console.log(subscribedChannel);
    if(!subscribedChannel){
        throw new ApiError(500, "failed to fetch subscribed channel")
    }

    return res.status(200)
        .json(new ApiResponse(
            200,subscribedChannel.channel,"subscribed channel fetched successfully")
        )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}