import express from "express";
const commentRouter = express.Router();
import { authenticateToken } from "../authentication.js"
import {getComment, getComments, updateComment, makeComment, deleteComment} from "../controllers/commentController.js"

// Get Single comment
commentRouter.get("/comment", authenticateToken, getComment)
// Update Single comment
commentRouter.put("/comment", authenticateToken, updateComment)
// Delete Single comment
commentRouter.delete("/comment", authenticateToken, deleteComment)
// Make single comment
commentRouter.post("/comment", authenticateToken, makeComment)
// Get list of comments
commentRouter.get("/comment", getComments)
