// This file would contain code implemented by posts router
const { PrismaClient } = require("@prisma/client");
const { authRouter } = require("../routers/authRouter");
const prisma = new PrismaClient();

const getAllPosts = async (req, res) => {
    try {
        // get user id
        const userId = req.user.id;

        // retrieve associated user
        const user = await prisma.users.findFirst({
            where: {id: userId},
            omit: {password: true, createdAt: true, updatedAt: true}
        });
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        // get posts associated with user
        const posts = await prisma.posts.findMany({
            where:{
                authorId:userId
            }
        });
        return res.status(200).json({
            message: "Posts retrieved successfully",
            posts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while retrieving posts"});
    }
};
const getSinglePost = async (req, res) => {
    try {
        // obtain post id
        const postId = req.params.id
        if (!postId) {
            return res.status(400).json({
                message:"Post id not provided or is invalid"
            });
        }
        // find related post
        const post = await prisma.posts.findFirst({
            where:{
                id: postId
            },
            include:{
                author: true
            }
        });
        // send result to user
        if (!post) {
            return res.status(404).json({
                message: "No posts associated with id. Ensure correct id"
            });
        }
        return res.status(200).json({
            message: "Post retrieved successfully",
            data: {
                id: post.id,
                title: post.title,
                content: post.content,
                author: post.author.username,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        });
    } catch (error) {
       console.log(error);
       return res.status(500).json({message:"Error retrieving post"});
    }
};
const createPost = async (req, res) => {
    try {
        const { title, content, status } = req.body;
        // get author id
        const userId = req.user.id;
        const user = await prisma.users.findFirst({
            where:{ id: userId },
            omit:{ password: true, createdAt: true, updatedAt: true}
        });

        if (!user) return res.status(404).json({message: "No user found"});
        const userRole = user.role.toLowerCase();
        if ( userRole !== "admin" && userRole !== "author") {
            return res.status(401)
                .json({message:"Only admins and authors can create posts"});
        }
        // create post
        const newPost = await prisma.posts.create({
            data:{
                title, content, status,
                authorId: user.id
            },
        });

        if (newPost){
            return res.status(201)
                .json({message: "Post created successfully",
                    data:{
                        id: newPost.id,
                        title: newPost.title,
                        content: `${newPost.content.slice(200)}...`
                    }
                });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while creating posts"});
    }
};
const updatePost = async (req, res) => {
    try {
        // Obtain postId, userId and updated post's content
        const { id } = req.params;
        const userId = req.user.id;
        const { title, content, status } = req.body;

        // find post with the given id
        const post = await prisma.posts.findFirst({
            where:{ id: id },
            include: { author: true }
        });
        if (!post) {
            return res.status(404).json({message: "No posts found with related id"});
        }
        // ensure only authors can edit the post
        if (post.authorId !== userId) {
            return res.status(401).json({message: "Only authors of this post can edit it"});
        }
        // update post
        const updatedPost = await prisma.posts.update({
            where: { id: id },
            data: {
                title: title,
                content: content,
                status: status,
            },
            include: { author: true }
        });
        // return post information
        return res.status(200).json({
            message: "Post updated successfully",
            data: {
                id: updatePost.id,
                title: updatePost.title,
                content: updatedPost.content,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt,
                author: updatedPost.author.username
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while updating post"});
    }
};

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    updatePost
};