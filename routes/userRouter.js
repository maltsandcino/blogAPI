import express from "express";
const userRouter = express.Router();
// const commentController = require("../controllers/commentController");
// const postController = require("../controllers/postController");
import { getUser, createUser, loginUser } from "../controllers/userController.js";
import { authenticateToken } from "../authentication.js"

// All routes besides logging in and creating a user should be projected by JSON webtokens.
userRouter.post("/user", createUser)
userRouter.post("/login", loginUser)

// Get Home 
userRouter.get("/user", authenticateToken, getUser)

export default userRouter;
