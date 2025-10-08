const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],

    },
    dateOfBirth: {
        type: String,

    },
    about: {
        type: String,
    },
    contactNumber: {
        type: String,

    }
}, {timestamps: true});

module.exports = mongoose.model("Profile", profileSchema);