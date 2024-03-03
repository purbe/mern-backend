import mongoose from "mongoose";
import { MONGO_DATABASE } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI2}/test`)
        console.log(`
 MongoDb connected !! DB HOST : ${connectionInstance.connection.host}`);
    }catch (error){
        console.log("mongoDB connection error", error);
        process.exit(1)
    }
}

export default connectDB;