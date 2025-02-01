// This file would contain code implemented by comments router
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSingleComment = async (req, res) => {
    try {
        // obtain userId and postId
        const userId = req.user.id;
        const commentId = req.params.id;
        // retrieve the comment or respond with not found
        const comment = await prisma.comments.findFirst({
            where: { id: commentId },
            include: { user: true, 
                post: { include: { author: true } }
            }
        });
        if (!comment) {
            return res.status(404).json({message: "No comments found" });
        }
        // return comment
        return res.status(200).json({
            message: "Comment retrieved successfully",
            data: {
                id: comment.id,
                username: comment.user.username,
                role: comment.user.role,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                post:{
                    id: comment.post.id,
                    title: comment.post.title,
                    author: comment.post.author.username,
                    createdAt: comment.post.createdAt,
                    updatedAt: comment.post.updatedAt
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while retrieiving comments"
        });
    }
};
const updateComment = async (req, res) => {
    try {
        // obtain userId, commentId and content
        const userId = req.user.id;
        const commentId = req.params.id;
        const { content } = req.body;
        // check if comment exists or return an error
        const comment = await prisma.comments.findFirst({
            where : { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // check if current user is the author of the comment
        if (comment.userId !== userId){
            res.status(403).json({ 
                message: "Only author of this comment can edit it."
            });
        }
        // prevent update if no changes in comment
        if (comment.content === content.trim()) {
            res.status(400).json({ message: "No detected changes in comment"});
        }
        // update the comment
        const updatedComment = await prisma.comments.update({
            where: { id: commentId },
            data :{ content : content},
            include: { user: true, 
                post: { include: { author: true } }
            }
        });
        // return the updated comment
        return res.status(200).json({
            message: "Comment updated successfully",
            data: {
                id: updatedComment.id,
                username: updatedComment.user.username,
                role: updatedComment.user.role,
                content: updatedComment.content,
                createdAt: updatedComment.createdAt,
                updatedAt: updatedComment.updatedAt,
                post:{
                    id: updatedComment.post.id,
                    title: updatedComment.post.title,
                    author: updatedComment.post.author.username,
                    createdAt: updatedComment.post.createdAt,
                    updatedAt: updatedComment.post.updatedAt
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while updating comment"
        });
    }
};
const deleteComment = async (req, res) => {
    try {
        // obtain userId, commentId
        const userId = req.user.id;
        const commentId = req.params.id;

        // check if comment exists or return an error
        const comment = await prisma.comments.findFirst({
            where : { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // check if current user is the author of the comment
        if (comment.userId !== userId && req.user.role !== "admin"){
            res.status(403).json({ 
                message: "Only author of this comment and admins can delete it"
            });
        }
        // delete comment
        const deletedComment = await prisma.comments.delete({
            where : { id: commentId },
            include: { user: true, 
                post: { include: { author: true } }
            }
        });
        return res.status(200).json({
            message: "Comment updated successfully",
            data: {
                id: deletedComment.id,
                username: deletedComment.user.username,
                role: deletedComment.user.role,
                content: deletedComment.content,
                createdAt: deletedComment.createdAt,
                updatedAt: deletedComment.updatedAt,
                post:{
                    id: deletedComment.post.id,
                    title: deletedComment.post.title,
                    author: deletedComment.post.author.username,
                    createdAt: deletedComment.post.createdAt,
                    updatedAt: deletedComment.post.updatedAt
                }
            }
        });    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error while deleting comment"});
    }
};
module.exports = {
    getSingleComment,
    updateComment,
    deleteComment
};