require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendMail } = require("../utils/sendMail");
const DB_SALT = parseInt(process.env.DB_SALT);
const JWT_SECRET = process.env.JWT_SECRET;
const otpGen = require("otp-generator");
const TEN_MINUTES = 10 * 60 * 1000;
const TEST_RECEPIENT = process.env.TEST_RECEPIENT;

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
                message: "If email exists, a reset code has been sent."
            });
        }
        // Generate reset code
        const resetCode = otpGen.generate(6, {
            digits: true, 
            lowerCaseAlphabets: false,
            upperCaseAlphabets:false,
            specialChars: false
        }).toString();
        const hashedCode = await bcrypt.hash(resetCode, DB_SALT);
        const expiresAt = new Date(Date.now() + TEN_MINUTES);

        // delete existing reset codes
        await prisma.passwordReset.deleteMany({where: {userId : user.id}});

        // save reset code and expiration
        await prisma.passwordReset.create({
            data: { resetCode: hashedCode, expiresAt, userId: user.id}
        });

        // Send reset email
        const subject = "Email reset for blogging app";
        const message = `Your password reset code is: ${resetCode}. It expires in 10 minutes.`
        await sendMail(TEST_RECEPIENT, subject, message);

        return res.status(200).json({
            message: "If email exists, a reset code has been sent."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}
const verifyResetCode = async (req, res) =>{
    try {
        // obtain reset code
        const { email, resetCode } = req.body;
        console.log({email, resetCode});
        // Check if in db or send error message
        const user = await prisma.users.findUnique({
            where : { email }
        });
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: "Invalid reset request. Kindly retry."
            });
        }
        // check if reset code is correct or send error message
        const resetRequest = await prisma.passwordReset.findUnique({
            where : { userId: user.id }
        });
        console.log(resetRequest);

        const isMatch = await bcrypt.compare(resetCode, resetRequest.resetCode);
        if (!resetRequest || !isMatch) {
            return res.status(400).json({ message: "Invalid reset code" });
        }
        // check it the time has "expired" or send error message
        if (Date.now() > resetRequest.expiresAt) {
            return res.status(400).json({ message: "Reset code expired." });
        }

        return res.status(200).json({ message: "Reset code verified successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error" });
    }
}
const resetPassword = async (req, res) =>{
    try {
        const { email, resetCode, password, password2 } = req.body;
        // check if a reset request exists
        const user = await prisma.users.findUnique({
            where: { email }, 
            omit:{ password: true }
        });
        if (!user) {
            return res.status(400).json({ 
                message: "Error. Ensure email is correct."
            });
        }
        const resetRequest = await prisma.passwordReset.findUnique({
            where : { userId: user.id}
        });
        if (!resetRequest) {
            return res.status(400).json({ 
                message: "Error. Ensure reset code has been requested."
            });
        }
        // check if the reset code is correct
        const isMatch = await bcrypt.compare(resetCode, resetRequest.resetCode);
        if (!resetRequest.resetCode || !isMatch) {
            return res.status(400).json({ 
                message: "Request code invalid. Please retry."
            });
        }
        // check if reset code has not expired
        if (Date.now() > resetRequest.expiresAt) {
            return res.status(400).json({ 
                message: "Request code expired or invalid. Request for a new code"
            });
        }
        // check if passwords match
        if ( password !== password2 ) {
            return res.status(400).json({
                message: "Reset failed. Passwords do not match!"
            });
        }
        // perform the reset of the password
        const newPassword = await bcrypt.hash(password, DB_SALT);
        const updatedUser = await prisma.users.update({
            data: { password: newPassword },
            select: {
                username : true, 
                email: true,
                role : true, 
                updatedAt : true, 
                createdAt : true
            },
            where : { id: user.id }
        });

        // Send email to user on password change
        const subject = "Password change on your bloggingApp account";
        const message = `Your password was successfully changed. If this 
        was you, you do not have to do anything. Otherwise, your account 
        might have been compromised.
        `;
        await sendMail(TEST_RECEPIENT, subject, message);

        // delete reset entry
        await prisma.passwordReset.delete({
            where:{ userId: user.id }
        });

        // send response to frontend
        return res.status(200).json({ 
            message: "Password reset successful",
            data : { ...updatedUser, password }
         });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error" });
    }
}
module.exports = {
    getSignupPage,
    postSignup,
    getLoginPage,
    postLogin,
    requestResetCode,
    verifyResetCode,
    resetPassword
};