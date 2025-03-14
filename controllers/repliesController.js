const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllReplies = async (req, res) => {
    try {
        // get comment id
        const { commentId } = req.params;

        // Find comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId },
            include: { user: true}
        });
        if (!comment) {
            return res.status(404).json({ 
                message: "No comments found with this id" 
            });
        }
        // retrieve replies
        const replies = await prisma.replies.findMany({
            where: { commentId: commentId},
            include: { user: true, comment: {include: {user: true}}}
        });
        const repliesData = replies.map((reply) =>{
            return {
                id: reply.id,
                comment: reply.comment.content,
                commentAuthor: reply.comment.user.username,
                reply: reply.content,
                replyAuthor: reply.user.username,
                role: reply.user.role,
                dateCreated: reply.createdAt,
                dateUpdated: reply.updatedAt
            }
        });
        return res.status(200).json({ 
            message: "Replies fetched successfully",
            data: {
                id: commentId,
                comment: comment.content,
                commentAuthor: comment.user.username,
                role: comment.user.role,
                replies : repliesData,
                dateCreated: comment.createdAt,
                dateUpdated: comment.updatedAt
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const getSingleReply = async (req, res) => {
    try {
        // get reply id and comment id
        const { commentId, id } = req.params;

        // Retrieve comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ 
                message: "No comments found with this id" 
            });
        }
        
        // Retrieve replies
        const reply = await prisma.replies.findUnique({
            where: { id: id },
            include: { 
                comment: {
                    include: { user: true }
                }, 
                user: true 
            }
        });
        return res.status(200).json({ 
            message: "Reply retrieved successfully",
            data: {
                id: reply.id,
                content: reply.content,
                replyAuthor: reply.user.username,
                role: reply.user.role,
                comment: {
                    id: reply.comment.id,
                    content: reply.comment.content,
                    commentAuthor: reply.comment.user.username,
                    role: reply.comment.user.role,
                    createdAt: reply.comment.createdAt,
                    updatedAt: reply.comment.updatedAt
                },
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt                
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const createReply = async (req, res) => {
    try {
        // get comment id and reply content, userId
        const commentId = req.params.commentId;
        const { content } = req.body;
        const userId = req.user.id;

        // Find comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ 
                message: "No comments found with this id" 
            });
        }
        // Create a reply to the comment
        const reply = await prisma.replies.create({
            data: { content, userId: userId, commentId: commentId },
            include: {
                comment : {include: {user: true}}, 
                user: { omit: { password: true }}
            }
        });
        return res.status(201).json({
            message:"Reply to comment created successfully",
            data: {
                id: reply.id,
                comment: reply.comment.content,
                commentAuthor: reply.comment.user.username,
                reply: reply.content,
                replyAuthor: reply.user.username,
                role: reply.user.role,
                dateCreated: reply.createdAt,
                dateUpdated: reply.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const updateReply = async (req, res) => {
    try {
        // Obtain commentId and replyId
        const { commentId, id} = req.params;
        const { content } = req.body;
        // Find comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ 
                message: "No comments found with this id" 
            });
        }
        // Retrieve replies
        const reply = await prisma.replies.findUnique({
            where: { id: id },
            include: { user: true }
        });
        if (!reply) {
            return res.status(404).json({ 
                message: "No reply found with this id" 
            });
        }
        // Ensure only the reply creator can edit it.
        if (reply.userId !== req.user.id) {
            return res.status(400).json({
                message: "Only the author can edit this reply."
            });
        }
        // Edit reply
        const updatedReply = await prisma.replies.update({
            data: { content},
            where: { id: id },
            include: { comment: { include: { user: true }}, user: true }
        });
        return res.status(200).json({
            message: "Reply updated successfully",
            data:{
                id: updatedReply.id,
                comment: updatedReply.comment.content,
                commentAuthor: updatedReply.comment.user.username,
                reply: updatedReply.content,
                replyAuthor: updatedReply.user.username,
                role: updatedReply.user.role,
                dateCreated: updatedReply.createdAt,
                dateUpdated: updatedReply.updatedAt,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const deleteReply = async (req, res) => {
    try {
        // get commentId and replyId
        const { commentId, id} = req.params;
        // Find comment
        const comment = await prisma.comments.findUnique({
            where: { id: commentId }
        });
        if (!comment) {
            return res.status(404).json({ 
                message: "No comments found with this id" 
            });
        }
        // find reply
        const reply = await prisma.replies.findUnique({
            where: { id: id }
        });
        if (!reply) {
            return res.status(404).json({ 
                message: "No reply found with this id" 
            });
        }
        // Ensure only the reply creator can delete it.
        if (reply.userId !== req.user.id) {
            return res.status(400).json({
                message: "Only the author can delete this reply."
            });
        }
        // delete reply
        const deletedReply = await prisma.replies.delete({
            where: { id: id },
            include: { 
                comment: {
                    include: { user: true }
                }, 
                user: true 
            }
        });
        // send response
        return res.status(200).json({
            message: "Reply deleted successfully",
            data: {
                id: deletedReply.id,
                content: deletedReply.content,
                replyAuthor: deletedReply.user.username,
                role: deletedReply.user.role,
                comment: {
                    id: deletedReply.comment.id,
                    content: deletedReply.comment.content,
                    commentAuthor: deletedReply.comment.user.username,
                    role: deletedReply.comment.user.role,
                    createdAt: deletedReply.comment.createdAt,
                    updatedAt: deletedReply.comment.updatedAt
                },
                createdAt: deletedReply.createdAt,
                updatedAt: deletedReply.updatedAt                
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

module.exports = {
    getAllReplies,
    getSingleReply,
    createReply,
    updateReply,
    deleteReply
}