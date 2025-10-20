const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    
    accountType: {
        type: String,
        enum: ["Student", "Instructor", "Admin"]
    },
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }],
    refreshToken: {
        type: String,
    },
    
}, {timestamps: true});

module.exports = mongoose.model("User", user_schema);