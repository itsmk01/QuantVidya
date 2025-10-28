const mongoose = require("mongoose");

const contactUs_schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    message:{
        type: String,
        required: true,
        trim: true,
    },
    resolved: {
        type: Boolean,
        default: false,
    }
    
}, {timestamps: true});

module.exports = mongoose.model("ContactUs", contactUs_schema);