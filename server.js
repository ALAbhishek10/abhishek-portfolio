
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve portfolio files
app.use(express.static(path.join(__dirname, "public")));

// Contact form API
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "Database is not connected yet. Please try again later."
            });
        }

        const Contact = require("./models/Contact");

        await Contact.create({ name, email, message });

        res.json({
            success: true,
            message: "Your message has been sent successfully!"
        });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from your .env file.");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Portfolio running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
    }
}

startServer();
