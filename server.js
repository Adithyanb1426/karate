const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());

const users = {}; // Store users temporarily (use a database in production)

// 🚀 Signup API: Send Verification Email
app.post("/signup", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const token = crypto.randomBytes(32).toString("hex");
    users[email] = { verified: false, token };

    const verificationLink = `http://localhost:5000/verify?email=${email}&token=${token}`;

    sendVerificationEmail(email, verificationLink);

    res.json({ message: "Verification email sent. Please check your inbox." });
});

// 🚀 Email Verification API
app.get("/verify", (req, res) => {
    const { email, token } = req.query;
    if (users[email] && users[email].token === token) {
        users[email].verified = true;
        res.send("Email verified successfully! You can now log in.");
    } else {
        res.status(400).send("Invalid or expired verification link.");
    }
});

// 🚀 Function to Send Email
function sendVerificationEmail(email, link) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: "your-email@gmail.com", pass: "your-email-password" },
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Verify Your Email - Karate School",
        html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Error sending email:", error);
        else console.log("Verification email sent:", info.response);
    });
}

app.listen(5000, () => console.log("Server running on port 5000"));
