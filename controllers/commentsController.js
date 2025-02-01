// This file would contain code implemented by comments router
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSingleComment = async (req, res) => {
    try {
        return res.status(500).json({
            message: "Get a single comment"
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
        return res.status(500).json({
            message: "Update a single comment"
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while retrieiving comments"
        });
    }
};
const deleteComment = async (req, res) => {
    try {
        return res.status(500).json({
            message: "Delete a single comment"
        });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while retrieiving comments"
        });
    }
};
module.exports = {
    getSingleComment,
    updateComment,
    deleteComment
};