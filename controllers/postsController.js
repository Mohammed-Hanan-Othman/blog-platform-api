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
        if ( userRole !== "admin" || userRole !== "author") {
            return res.status(401)
                .json({message:"Only admins and authors can create posts"});
        }
        // create post
        const newPost = await prisma.posts.create({
            data:{
                title, content, status
            },
            omit:{
                authorId: true, createdAt: true, updatedAt: true,
            }
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

module.exports = {
    getAllPosts,
    createPost
};