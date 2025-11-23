import express from "express";
const blogRouter = express.Router();
import { authenticateToken } from "../authentication.js"
import {updateBlog, makeBlog, deleteBlog} from "../controllers/blogController.js"


blogRouter.put("/blog", authenticateToken, updateBlog)

blogRouter.delete("/blog", authenticateToken, deleteBlog)

blogRouter.post("/blog", authenticateToken, makeBlog)

// getComment, getComments,

export default blogRouter