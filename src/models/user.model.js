import mongoose, {Schema}  from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
                username:{
                    type:String,
                    require:true,
                    unique:true,
                    toLowerCase:true,
                    trim:true,
                    index:true
                },
        email:{
            type:String,
            require:true,
            unique:true,
            toLowerCase:true,
            trim:true
        },
        fullName:{
            type:String,
            require:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url
            require:true,
        },
        coverImage:{
            type:String,
        },
        refreshToken:{
            type:String,
        },
        password:{
            type:String,
            require:[true,"password is required"]
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        },
    {timestamps:true}
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password= bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SCERET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken= function (){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SCERET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}



export const User=mongoose.model("User",userSchema)