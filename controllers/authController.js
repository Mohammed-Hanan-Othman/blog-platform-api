require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DB_SALT = parseInt(process.env.DB_SALT);
const JWT_SECRET = process.env.JWT_SECRET;

const getSignupPage =  (req, res) => {
    res.status(200).json({message:"Register here"});
}

const postSignup = async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, DB_SALT);
        // create new user with hashed password
        const newUser = await prisma.users.create({
            data: {
                username: username,
                email: email,
                role: role,
                password: hashedPassword
            }
        });
        const userData = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
        return res.status(201).json({
            message: "New user created successfully",
            data: userData
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

const getLoginPage = (req, res) => {
    res.status(200).json({message:"This is the login page"});
}

const postLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        // generate token
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign( userData, JWT_SECRET, { expiresIn: "1hr" });
        return res.status(200).json({
            message: "Login successful",
            token:token,
            userData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}
const requestResetCode = async (req, res) => {
    try {
        const { email } = req.body;
        // check if user already exists
        const user = await prisma.users.findUnique({
            where: { email: email },
            omit: { password: true }
        });
        if (!user) {
            return res.status(401).json({
                message: "No users exist with the given email."
            });
        }
        // send password reset code to user email
        return res.status(200).json({
            message: "Reset code sent successfully to email"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
module.exports = {
    getSignupPage,
    postSignup,
    getLoginPage,
    postLogin,
    requestResetCode
};