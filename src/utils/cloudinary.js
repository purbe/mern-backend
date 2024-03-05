import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// const connectCloudinary = async()=> {
//     try {
//         const connectionIns = await cloudinary.config({
//             cloud_name: process.env.CLOUDINARY_NAME,
//             api_key: process.env.CLOUDINARY_API_KEY,
//             api_secret: process.env.CLOUDINARY_API_SECRET
//         });
//
//         console.log(`cloudinary is connected ${connectionIns.cloud_name}`);
//
//     } catch (err) {
//         console.log("cloudinary connection error ", err);
//         process.exit(1);
//     }
// }


const uploadCloudinary = async (localFilePath)=>{

    try{
        if(!localFilePath) return null;
       const response= await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"},
           (error ,result)=>{console.log(result);});

       console.log("file is uploaded on cloudinary",response.url);
       return response;
    }catch (err){
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload operation got failed
        return null;
    }
}

export default uploadCloudinary;
