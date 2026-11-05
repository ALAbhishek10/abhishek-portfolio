require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Profile = require("./models/profile");
const Contact = require("./models/contact");
const Feedback = require("./models/feedback");

const app = express();
const PORT = process.env.PORT || 3003;


// ==================================
// MIDDLEWARE
// ==================================

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


// ==================================
// HOME PAGE
// ==================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ==================================
// HEALTH CHECK
// ==================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "running",
        database: mongoose.connection.readyState === 1
            ? "connected"
            : "disconnected"
    });
});


// ==================================
// SAVE PROFILE
// ==================================

app.post("/api/profile", async (req, res) => {
    try {
        const data = req.body || {};

        const requiredFields = [
            "fullName",
            "email",
            "course",
            "institution",
            "university",
            "studyYear",
            "headline",
            "summary",
            "languages",
            "interests",
            "skills",
            "projects"
        ];

        const missingFields = requiredFields.filter(field =>
            typeof data[field] !== "string" ||
            data[field].trim() === ""
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields.",
                missingFields
            });
        }

        const email = data.email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        let graduationYear = null;

        if (
            data.graduationYear &&
            String(data.graduationYear).trim() !== ""
        ) {
            graduationYear = Number(data.graduationYear);

            if (
                !Number.isInteger(graduationYear) ||
                graduationYear < 2020 ||
                graduationYear > 2040
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid graduation year."
                });
            }
        }

        const profileData = {
            fullName: data.fullName.trim(),
            email,
            linkedin:
                typeof data.linkedin === "string"
                    ? data.linkedin.trim()
                    : "",
            course: data.course.trim(),
            institution: data.institution.trim(),
            university: data.university.trim(),
            studyYear: data.studyYear.trim(),
            graduationYear,
            educationDetails:
                typeof data.educationDetails === "string"
                    ? data.educationDetails.trim()
                    : "",
            headline: data.headline.trim(),
            summary: data.summary.trim(),
            languages: data.languages.trim(),
            interests: data.interests.trim(),
            skills: data.skills.trim(),
            projects: data.projects.trim(),
            certification:
                typeof data.certification === "string"
                    ? data.certification.trim()
                    : ""
        };

        const savedProfile = await Profile.findOneAndUpdate(
            {},
            { $set: profileData },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        console.log("Profile saved:", savedProfile._id);

        res.status(201).json({
            success: true,
            message: "Your profile has been saved successfully!"
        });

    } catch (error) {
        console.error("PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save your profile."
        });
    }
});


// ==================================
// GET PROFILE
// ==================================

app.get("/api/profile", async (req, res) => {
    try {
        const profile = await Profile.findOne()
            .sort({ updatedAt: -1 });

        if (!profile) {
            return res.status(404).json({
                message: "No profile has been saved yet."
            });
        }

        res.json(profile);

    } catch (error) {
        console.error("PROFILE RETRIEVAL ERROR:", error);

        res.status(500).json({
            message: "Unable to retrieve profile."
        });
    }
});


// ==================================
// EXISTING CONTACT FORM
// ==================================

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        const savedContact = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });

        console.log("Contact saved:", savedContact._id);

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (error) {
        console.error("CONTACT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send your message."
        });
    }
});


// ==================================
// SUBMIT FEEDBACK
// ==================================

app.post("/api/feedback", async (req, res) => {
    try {
        const { name, message } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter your name and feedback."
            });
        }

        const feedback = await Feedback.create({
            name: name.trim(),
            message: message.trim()
        });

        console.log("Feedback saved:", feedback._id);

        res.status(201).json({
            success: true,
            message: "Thank you! Your feedback has been submitted."
        });

    } catch (error) {
        console.error("FEEDBACK ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit feedback."
        });
    }
});


// ==================================
// GET ALL FEEDBACK
// ==================================

app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 });

        res.json(feedbacks);

    } catch (error) {
        console.error("FEEDBACK RETRIEVAL ERROR:", error);

        res.status(500).json({
            message: "Unable to load feedback."
        });
    }
});


// ==================================
// UNKNOWN API ROUTES
// ==================================

app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API route not found."
    });
});


// ==================================
// CONNECT DATABASE AND START SERVER
// ==================================

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env.");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Portfolio running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("SERVER STARTUP ERROR:", error);
    }
}

startServer();