// This file would contain code implemented by posts router
const { PrismaClient } = require("@prisma/client");
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
                        content: `${newPost.content.slice(200)}...`,
                        createdAt: newPost.createdAt,
                        updatedAt: newPost.updatedAt
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
                id: updatedPost.id,
                author: updatedPost.author.username,
                title: updatedPost.title,
                content: updatedPost.content,
                status: updatedPost.status,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while updating post"});
    }
};
const deletePost = async (req, res) => {
    try {
        // obtain userId and the postId
        const userId = req.user.id;
        const postId = req.params.id;
        // check if post exist
        const post = await prisma.posts.findFirst({
            where:{ id: postId },
        });
        if (!post) {
            return res.status(404).json({message: "No posts found"});
        }
        // check if user is allowed to delete a post
        if (post.authorId !== userId && req.user.role !== "admin") {
            return res.status(401).json({
                message: "Only authors and admins can delete this post"
            });
        }
        // delete post
        const deletedPost = await prisma.posts.delete({
            where:{ id : postId },
            include:{ author : true }
        });
        // send json to inform about deleted post
        return res.status(200).json({
            message: "Post deleted successfully",
            data: {
                id: deletedPost.id,
                author: deletedPost.author.username,
                title: deletedPost.title,
                content: deletedPost.content,
                createdAt: deletedPost.createdAt,
                updatedAt: deletedPost.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while deleting post"});
    }
};
const updatePostStatus = async (req, res) => {
    try {
        // Obtain postId, userId and updated post's status
        const { id } = req.params;
        const userId = req.user.id;
        const { status } = req.body;

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
            return res.status(401).json({
                message: "Only authors of this post can change post status"
            });
        }
        // update post
        const updatedPost = await prisma.posts.update({
            where: { id: id },
            data: { status: status },
            include: { author: true }
        });
        // return post information
        return res.status(200).json({
            message: "Post status updated successfully",
            data: {
                id: updatedPost.id,
                author: updatedPost.author.username,
                title: updatedPost.title,
                content: updatedPost.content,
                status: updatedPost.status,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error updating post status"});
    }
};
const getAllComments = async (req, res) => {
    try {
        // get userId, postId,
        const userId = req.user.id;
        const postId = req.params.id;
        // check if post exists
        const post = await prisma.posts.findFirst({
            where: { id: postId },
            include: { author: true }
        });
        if (!post) {
            return res.status(404).json({message: "No posts found"});
        }
        // get all comments
        const comments = await prisma.comments.findMany({
            where: { postId: postId},
            include: { user: true },
        });
        const commentData = comments.map((comment) => {
            return {
                id: comment.id,
                username: comment.user.username,
                content: comment.content,
                userRole: comment.user.role,
                createdAt: comment.createdAt,
                updatedAt : comment.updatedAt
            };
        });

        // send comments json
        return res.status(200).json({
            message: "Comments retrieved successfully",
            data: {
                id: post.id,
                postTitle: post.title,
                author: post.author.username,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                comments: commentData
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message:"Error retrieving comments" });
    }
};
const createComment = async (req, res) => {
    try {
        // get postId and userId and content
        const postId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;
        // check if post exists
        const post = await prisma.posts.findFirst({
            where: { id: postId }
        });
        if (!post) {
            return res.status(400).json({message:"No post found"});
        }
        // ensure post has been published first
        if (post.status !== "published") {
            return res.status(400).json({ message:"Post not published yet" });
        }
        // create comment on the post
        const comment = await prisma.comments.create({
            data:{ content : content, postId: postId, userId: userId},
            include : { 
                post:{ include: { author: true } },
                user: true
            }
        });
        // return comment info
        return res.status(201).json({
            message:"Comment created successfully",
            data: {
                id: comment.id,
                content: comment.content,
                user: comment.user.username,
                role: comment.user.role,
                post : {
                    postId: comment.postId,
                    title: comment.post.title,
                    author: comment.post.author.username,
                },
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error while commenting on post"});
    }
};

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    updatePost,
    deletePost,
    updatePostStatus,
    getAllComments,
    createComment
};


// /comments/:commentId/replies
// /replies?commentId={id}