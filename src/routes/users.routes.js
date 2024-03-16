
import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {loginUser, logoutUser, registerUSer} from "../controller/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),

    registerUSer
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

export default router;