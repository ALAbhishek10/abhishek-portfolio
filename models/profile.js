const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    linkedin: {
        type: String,
        default: ""
    },

    course: {
        type: String,
        required: true,
        trim: true
    },

    institution: {
        type: String,
        required: true,
        trim: true
    },

    university: {
        type: String,
        required: true,
        trim: true
    },

    studyYear: {
        type: String,
        required: true,
        trim: true
    },

    graduationYear: {
        type: Number,
        default: null,
        min: 2020,
        max: 2040
    },

    educationDetails: {
        type: String,
        default: ""
    },

    headline: {
        type: String,
        required: true,
        trim: true
    },

    summary: {
        type: String,
        required: true,
        trim: true
    },

    languages: {
        type: String,
        required: true,
        trim: true
    },

    interests: {
        type: String,
        required: true,
        trim: true
    },

    skills: {
        type: String,
        required: true,
        trim: true
    },

    projects: {
        type: String,
        required: true,
        trim: true
    },

    certification: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;