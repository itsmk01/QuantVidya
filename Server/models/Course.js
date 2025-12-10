const mongoose = require("mongoose");

const course_schema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true,
        trim: true
    },
    courseDescription:{
        type: String,
        required: true,
        trim: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    thumbnail:{
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tag: {
        type: [String],
        required: true,
    },
    instructions: {
		type: [String],
	},
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    status: {
        type: String,
        enum: ["Draft", "Published"],
    }
}, {timestamps: true});

module.exports = mongoose.model("Course", course_schema);