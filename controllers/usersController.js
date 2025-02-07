// This file would contain code implemented by users router
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        // ensure the user is the admin
        const userId = req.user.id;
        const user = await prisma.users.findUnique({
            where:{
                id: userId
            }
        });
        if (user.role !== "admin") {
            return res.status(401).json({ 
                message: "Only admins can access all user information" 
            });
        }
        // fetch all users
        const users = await prisma.users.findMany({
            omit: { password: true },
            orderBy : { role: "asc" }
        });
        if (!users) {
            return res.status(401).json({ message: "No users found" });
        }
        // output the data in json
        return res.status(200)
            .json({ message: "Users retrieved successfully", data : users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error obtaining users information"});
    }
};
const getSingleUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const personId = req.params.id;
        // ensure the user is the admin
        const user = await prisma.users.findUnique({
            where:{
                id: userId
            }
        });
        if (user.role !== "admin") {
            return res.status(401).json({ 
                message: "Only admins can access all user information"
            });
        }
        // obtain person information
        const person = await prisma.users.findFirst({ 
            where: { id : personId },
            omit: { password: true }
        });
        if (!person) {
            return res.status(400).json({ 
                message: "No users found. Id may be incorrect"
            });
        }
        // output the data in json
        return res.status(200)
            .json({ message: "Users retrieved successfully", data : person });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Error obtaining user information"
        });
    }
};
const deleteSingleUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const personId = req.params.id;
        // ensure the user is the admin
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if (user.role !== "admin") {
            return res.status(401).json({ 
                message: "Only admins can delete user information"
            });
        }
        // delete user posts and associated comments, then delete the user.
        const [deletedComments, deletedPosts, userDeleted]
            = await prisma.$transaction([
            // delete comments associated with the posts
            prisma.comments.deleteMany({
                where: { post:{authorId: userId}}
            }),
            // delete posts of user
            prisma.posts.deleteMany({
                where: { authorId: userId}
            }),
            // delete user
            prisma.users.delete({
                where : { id: userId }
            }),
        ]);
        return res.status(200).json({
            message:`User deleted successfully`,
            data: {
                postsDeleted : `deletedPosts`
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting user" });
    }
};
const getMyInfo = async (req, res) => {
    try {
        // retrieve user id
        const userId = req.user.id;
        // find user
        const user = await prisma.users.findFirst({
            where: { id: userId },
            omit: { password: true }
        });
        if (user.role !== req.user.role) {
            return res.status(500).json({ message: "Internal server error"});
        }
        // return user information
        return res.status(200).json({
            message: "Information retrieved successfully",
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Error retrieving user information" 
        });
    }
}
const updateMyInfo = async (req, res) => {
    try {
        // retrieve user id and related fields
        const userId = req.user.id;
        const { username, email } = req.body;
        // find user
        const user = await prisma.users.findFirst({
            where: { id: userId },
            omit: { password: true }
        });
        if (user.role !== req.user.role) {
            return res.status(500).json({ message: "Internal server error"});
        }
        // update user
        const updatedUser = await prisma.users.update({
            where: { id: userId},
            data : { username, email },
            omit: { password: true }
        });
        // return updated data
        return res.status(200).json({
            message: "User information updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: "Error updating user information" 
        });
    }
};
module.exports = {
    getAllUsers,
    getSingleUser,
    deleteSingleUser,
    getMyInfo,
    updateMyInfo,
};