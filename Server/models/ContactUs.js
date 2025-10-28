const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"]
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
            default: ""
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address"
            ]
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: [1000, "Message cannot exceed 1000 characters"]
        },
        resolved: {
            type: Boolean,
            default: false
        },
        resolvedAt: {
            type: Date,
            default: null
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    { 
        timestamps: true // Adds createdAt and updatedAt
    }
);

// Index for faster queries
contactUsSchema.index({ email: 1, resolved: 1 });
contactUsSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ContactUs", contactUsSchema);