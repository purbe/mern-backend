
import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {registerUSer} from "../controller/user.controller.js";


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

export default router;