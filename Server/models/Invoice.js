const mongoose = require("mongoose");

const invoice_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    address: {
        type: String, 
        required: true, 
    },
    pincode: {
        type: Number,
        required: true,
        trim: true
    }

}, {timestamps: true});

module.exports = mongoose.model("Invoice", invoice_schema);