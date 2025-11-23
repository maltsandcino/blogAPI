// import {getComment, getComments, updateComment, makeComment, deleteComment}

import { prisma } from "../lib/prisma.ts"; 
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"

export const makeBlog = async (req, res) => {
   try {
    const userId = Number(req.user.id)
    const description = req.body.description
    const title = req.body.title
    // Create
    const newBlog = await prisma.blog.create({
        data: {
            description: description,
            title: title,
            ownerId: userId,
        },
        select: {title: true, id: true, description: true }
        });
    return res.json(newBlog)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot create Blog" });
  }
};

export const updateBlog = async (req, res) => {
    if (!req.body.blogId) {
        return res.status(400).json({ error: "blogId is required" });
        }
    try {        
    const id = Number(req.body.blogtId)
    const userId = Number(req.user.id)
    const newDescription = req.body.description
    let title = req.body.title
    // Check Ownership
    const blog = await prisma.post.findUnique({ where: { id } });
        if (!blog|| blogt.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this blog" });
        }
    // A little check to make sure we have new content
    if (!title) title = post.title;
    if (!newContent) newContent = post.content;
        
    // Update
    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: {
            content: newContent,
            title: title,
        },
        select: { content: true, title: true, id: true }
        });
    return res.json(updatedPost)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot update post" });
  }
};

export const deleteBlog = async (req, res) => {
     try {
    if (!req.body.blogId) {
        return res.status(400).json({ error: "blogId is required" });
        }
    const id = Number(req.body.blogId)
    const userId = Number(req.user.id)
    // Check Ownership
    const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog || blog.ownerId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this blog" });
        }
    // Update
    await prisma.blog.delete({
        where: { id }})
    return res.json({message: "Blog Deleted"})}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot delete Blog" });
  }
};