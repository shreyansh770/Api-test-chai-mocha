const express = require('express')
const authenticateController = require('../controller/authenticatecontroller')
const useractionscontroller = require("../controller/useractionscontroller")
const postcontroller = require("../controller/postcontroller")
const { protectRoute } = require('../middleware/protectRoute')

const authRouter = express.Router()

authRouter.route("/authenticate").post(authenticateController.authenticate)
authRouter.route("/register").post(authenticateController.signIn)
authRouter.route("/follow/:id").post(protectRoute,useractionscontroller.followUser)
authRouter.route("/unfollow/:id").post(protectRoute,useractionscontroller.unfollowUser)
authRouter.route("/user").get(protectRoute,useractionscontroller.getUser)
authRouter.route("/posts/").post(protectRoute,postcontroller.addpost)
authRouter.route("/posts/:id").post(protectRoute,postcontroller.deletePost)
authRouter.route("/like/:id").post(protectRoute,postcontroller.likePost)
authRouter.route("/unlike/:id").post(protectRoute,postcontroller.unlikePost)
authRouter.route("/posts/:id").get(protectRoute,postcontroller.getPost)
authRouter.route("/all_posts").get(protectRoute,postcontroller.getAllPost)
authRouter.route("/comment/:id").post(protectRoute,postcontroller.commentPost)


module.exports = authRouter