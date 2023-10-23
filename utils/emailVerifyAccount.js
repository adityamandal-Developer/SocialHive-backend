const nodemailer = require("nodemailer");
require('dotenv').config()
const emailVerifyAccount = async (to, resetToken) => {
    try {
        //create transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER, //user email address,
                pass: process.env.GMAIL_PASS,
            },
        });
        //create msg
        const message = {
            to,
            subject: "Account Verification",
            html: `
            <p>You are receiving this email because you (or someone else) have requested to verify your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p>https://social-hive-frontend.vercel.app/account-verification/${resetToken}</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };
        //send the email
        const info = await transporter.sendMail(message);
        console.log("Email sent", info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed");
    }
};

module.exports = emailVerifyAccount;







