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
    const publicBlog = req.body.public;
    // Create
    const newBlog = await prisma.blog.create({
        data: {
            description: description,
            title: title,
            public: publicBlog,
            ownerId: userId,
        },
        select: {title: true, id: true, description: true, public: true, owner: true }
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

export const getBlogMostRecent = async (req, res) => {
    
    // We are going to zero index this in the react side
    const page = req.query.page + 1; 
    try {
        const pageSize = 10;
          const blogs = await prisma.blog.findMany({
            where: { public: true },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { created: "desc" },
            include: {
            owner: {
                select: { username: true }   // blog owner username
            },
            posts: {
                orderBy: { created: "desc" }, // newest post first
                take: 1,                      // 👈 only take the most recent post
                include: {
                user: {
                    select: { username: true } // post author username
                },
                comments: {
                    orderBy: { created: "desc" }, // newest comments first
                    include: {
                    user: {
                        select: { username: true } // comment author username
                    }
                    }
                }
                }
            }
            }})
  
    return res.json(blogs)
    } catch (error) {
    
        console.error(error);
    return res.status(500).json({ error: "Cannot fetch Blogs" });
}}

export const getBlog = async (req, res) => {

    const user = req.user;
    const blog = Number(req.query.blog)
    // First Route: Getting user's own blog
    if (!blog){
    try {
       const bloginDB = await prisma.blog.findFirst({
  where: { ownerId: user.id },
  include: {
    owner: true,
    posts: {
      orderBy: { created: 'desc' },   // make sure field matches your schema
      include: {
        user: {
          select: { username: true }    // post author username only
        },
        comments: {
          orderBy: { created: 'desc' },
          include: {
            user: {
              select: { username: true } // comment author username only
            }
          }
        }
      }
    }
  }
});
    return res.json(bloginDB)
    } catch (error) {
        console.error(error);
    return res.status(500).json({ error: "No Blog Found" });}}
    else {
        // Getting another person's blog
        try{
            const bloginDB = await prisma.blog.findUnique({
                where: { id: blog},
                include: {
    owner: true,
    posts: {
      orderBy: { created: 'desc' },   // make sure field matches your schema
      include: {
        user: {
          select: { username: true }    // post author username only
        },
        comments: {
          orderBy: { created: 'desc' },
          include: {
            user: {
              select: { username: true } // comment author username only
            }
          }
        }
      }
    }
  }
            });
        if (bloginDB.public || bloginDB.ownerId === user.id){
            console.log("found the blog")
            return res.json(bloginDB)
        }
        else{
            console.log("found the private blog")
            return res.status(401).json({error: "This blog is private"})
        }
        } catch (error) {
            console.log("problem")
            return res.status(500).json({error: "Problem accessing blog"})
        }
    }
}