require("dotenv").config();
const nodemailer = require("nodemailer");

const sendMail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message
    };
    // send email
    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail
};