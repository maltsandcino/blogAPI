// import {getpost, getposts, updatepost, makepost, deletepost}

import { prisma } from "../lib/prisma.ts"; 
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";

export const getPost = async (req, res) => {
    if (!req.body.postId) {
        return res.status(400).json({ error: "postId is required" });
        }
  try {
    const id = Number(req.body.postId)
    const post = await prisma.post.findUnique({where: { id }});
    return res.json(post)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching posts" });
  }
};

export const getPosts = async (req, res) => {
    try {
    const blogId = Number(req.body.blogId)
    const posts = await prisma.post.findMany({where: { blogId }});
    return res.json(posts)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching posts" });
  }
};

export const updatePost = async (req, res) => {
    if (!req.body.postId) {
        return res.status(400).json({ error: "postId is required" });
        }
    try {        
    const id = Number(req.body.postId)
    const userId = Number(req.user.id)
    const newContent = req.body.content
    let title = req.body.title
    // Check Ownership
    const post = await prisma.post.findUnique({ where: { id } });
        if (!post || post.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this post" });
        }
    // A little check to make sure we have new content
    if (!title) title = post.title;
    if (!newContent) newContent = post.content;
    
    // Update
    const updatedPost = await prisma.post.update({
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

export const makePost = async (req, res) => {
     try {

      if (!req.body.blogId) {
        return res.status(400).json({ error: "blogID is required is required" });
        }

    const userId = Number(req.user.id)
    const content = req.body.content
    const title = req.body.title
    const blogId = Number(req.body.blogId)
    // Create
    const newpost = await prisma.post.create({
        data: {
            content: content,
            title: title,
            userId: userId,
            blogId: blogId
        },
        select: { content: true, title: true, id: true, created: true }
        });
    return res.json(newpost)}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot create post" });
  }
  
};

export const deletePost = async (req, res) => {
  try {
    if (!req.body.postId) {
        return res.status(400).json({ error: "postId is required" });
        }
    const id = Number(req.body.postId)
    const userId = Number(req.user.id)
    // Check Ownership
    const post = await prisma.post.findUnique({ where: { id } });
        if (!post || post.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this post" });
        }
    // Update
    await prisma.post.delete({
        where: { id }})
    return res.json({message: "post Deleted"})}
    catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Cannot delete post" });
  }
};