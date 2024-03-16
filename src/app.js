//import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true, limit : "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

//routes import

import usersRoute from "./routes/users.routes.js";

//routes declaration
app.use("/api/v1/users",usersRoute)

//http://localhost:8080/users/register
// http://localhost:8000/api/v1/users/register

export {app};