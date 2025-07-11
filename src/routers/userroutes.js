import { Router } from "express";
import { loginUser,logoutUser,registerUser } from "../controllers/usercontroller.js";
import {upload} from "../middlewares/multermiddleware.js"
import { verifyJWT } from "../middlewares/authmiddleware.js";


const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
             name:"coverimage",
            maxCount:1
        }

    ]),
    registerUser);

router.route("/login").post(
    loginUser
)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser)

export default router;