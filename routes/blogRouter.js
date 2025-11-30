import express from "express";
const blogRouter = express.Router();
import { authenticateToken } from "../authentication.js"
import {updateBlog, makeBlog, deleteBlog, getBlogMostRecent, getBlog} from "../controllers/blogController.js"


blogRouter.put("/blog", authenticateToken, updateBlog)

blogRouter.delete("/blog", authenticateToken, deleteBlog)

blogRouter.post("/blog", authenticateToken, makeBlog)

blogRouter.get("/blog", authenticateToken, getBlog)

// Unprotected, only viewing public blogs
blogRouter.get("/blogs/", getBlogMostRecent)

// getComment, getComments,

export default blogRouter