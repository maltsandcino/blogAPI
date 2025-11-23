import express from "express";
const postRouter = express.Router();
import { authenticateToken } from "../authentication.js"
import {getPost, getPosts, updatePost, makePost, deletePost} from "../controllers/postController.js"

// Get Single post
postRouter.get("/post", authenticateToken, getPost)
// Update Single post
postRouter.put("/post", authenticateToken, updatePost)
// Delete Single post
postRouter.delete("/post", authenticateToken, deletePost)
// Make single post
postRouter.post("/post", authenticateToken, makePost)
// Get list of posts
postRouter.get("/post", getPosts)

export default postRouter;