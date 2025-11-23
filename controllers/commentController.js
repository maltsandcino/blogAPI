import { prisma } from "../lib/prisma.ts"; 
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"

export const getComment = async (req, res) => {
    if (!req.body.commentId) {
        return res.status(400).json({ error: "commentId is required" });
        }
  try {
    const id = Number(req.body.commentId)
    const comment = await prisma.comment.findUnique({where: { id }});
    // Todo: Check for user ID and whether the post is private
    return res.json(comment)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching comment" });
  }
};

export const getComments = async (req, res) => {
    try {
    const postId = Number(req.body.postId)
    const comments = await prisma.comment.findMany({where: { postId }});
    return res.json(comments)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching comments" });
  }
};

export const updateComment = async (req, res) => {
    if (!req.body.commentId) {
        return res.status(400).json({ error: "commentId is required" });
        }
    try {        
    const id = Number(req.body.commentId)
    const userId = Number(req.user.id)
    const newContent = req.body.content
    let title = req.body.title
    // Check Ownership
    const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this comment" });
        }
    // A little check to make sure we have new content
    if (!title) title = comment.title;
    if (!newContent) newContent = comment.content;
    
    // Update
    const updatedComment = await prisma.comment.update({
        where: { id },
        data: {
            content: newContent,
            title: title,
        },
        select: { content: true, title: true, id: true }
        });
    return res.json(updatedComment)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot update comment" });
  }
};

export const makeComment = async (req, res) => {
     try {

      if (!req.body.commentId || req.body.postId) {
        return res.status(400).json({ error: "commentId / postId is required" });
        }

    const userId = Number(req.user.id)
    const content = req.body.content
    const title = req.body.title
    const postId = Number(req.body.postId)
    // Create
    const newComment = await prisma.comment.create({
        data: {
            content: content,
            title: title,
            userId: userId,
            postId: postId
        },
        select: { content: true, title: true, id: true }
        });
    return res.json(newComment)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot create Comment" });
  }
  
};

export const deleteComment = async (req, res) => {
  try {
    if (!req.body.commentId) {
        return res.status(400).json({ error: "commentId is required" });
        }
    const id = Number(req.body.commentId)
    const userId = Number(req.user.id)
    // Check Ownership
    const comment = await prisma.comment.findUnique({ where: { id } });
        if (!comment || comment.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this comment" });
        }
    // Update
    await prisma.comment.delete({
        where: { id }})
    return res.json({message: "Comment Deleted"})}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot delete comment" });
  }
};

