import { Router } from "express";
import {
    loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrenPassword, getCurrentUser,
    updateAccountDetails,
    updateCoverImage,
    getWatchHistory,
    getUserChannelProfile, updateAvatar
} from "../controllers/usercontroller.js";
import { upload } from "../middlewares/multermiddleware.js"
import { verifyJWT } from "../middlewares/authmiddleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }

    ]),
    registerUser);

router.route("/login").post(
    loginUser
)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrenPassword)
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser)

router.
route("/updateAccountDetails").
patch(verifyJWT, updateAccountDetails)
router.
route("/updateAvatar").
patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.
route("/updateCoverImage").
patch(verifyJWT, upload.single("coverimage"), updateCoverImage)
router.
route("/getWatchHistory").
get(verifyJWT, getWatchHistory)
router.
route("/c/:username").
get(verifyJWT, getUserChannelProfile)

export default router;