import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({path:'./env'})


connectDB()
.then(
    () => {
        app.listen(process.env.PORT || 8000,()=>console.log("server is running on port !!"));
        //console.log(`server is listening on port 8000`)
    }
)
.catch((error)=>{
    console.log("monogo connection failed ",error)
})