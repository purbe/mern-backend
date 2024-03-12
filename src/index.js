import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({path:'./env'})

//app.get("/",(req,res)=>{"hello world"})
connectDB()
.then(
    () => {
        app.listen(process.env.PORT || 8000,()=>console.log(`server is running on ${process.env.PORT}port !!`));
        //console.log(`server is listening on port 8000`)
    }
)
.catch((error)=>{
    console.log("mongo connection failed ",error)
})