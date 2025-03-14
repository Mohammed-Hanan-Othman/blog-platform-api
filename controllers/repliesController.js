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
        // GET a reply to a comment
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const createReply = async (req, res) => {
    try {
        // POST a reply
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
        // PUT a reply
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}
const deleteReply = async (req, res) => {
    try {
        // DELETE a reply
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