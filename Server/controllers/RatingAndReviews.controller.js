const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { populate } = require("../models/Profile");



//createRatingAndReview
exports.createRating = async (req, res) => {
    try{
        //get userId
        const userId = req.user.id;

        //get rating and review from req body
        const {rating , review, courseId} = req.body;

        

        //check user is already enrolled or not
        // const course = await Course.findById(courseId);
        // const uid = new mongoose.Types.ObjectId(String(userId));
        // if(!course.studentEnrolled.includes(uid)){
        //     return res.status(404).json({
        //         success: false,
        //         message: "User is not enrolled in the course !"
        //     });
        // }

        //check user is already enrolled or not
        const courseDetails = await Course.findOne({
                                                    _id: courseId,
                                                    studentEnrolled: { $elemMatch: {$eq: userId} },
                                                });
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course !"
            });
        }

        //check if user has already reviewed or not
        const alreadyReviewed = await RatingAndReview.findOne({
                                                                user:userId,
                                                                course: courseId,
                                                            });
        if(alreadyReviewed){
            return res.status(404).json({
                success: false,
                message: "User had already given the review ."
            });
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                                        rating, review,
                                                        user: userId,
                                                        course: courseId
                                                    });
        //update course 
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                            {$push: {ratingAndReviews: ratingReview._id}},
                                                            {new: true}
                                                        );
        //return response
        return res.status(200).json({
            success: true,
            message: "Course reviewed successfully.",
            ratingReview
        });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//get Average rating
exports.getAverageRating = async (req, res) => {
    try{
        //get courseId
        const courseId = req.body.courseId;
        
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: { course: new mongoose.Types.ObjectId(String(courseId))}
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            },
        ]);

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            });
        }

        return res.status(200).json({
            success: true,
            message: "Average rating is 0. No rating is given till now.",
            averageRating: 0,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get all rating and reviews based on courseId
exports.getAllRatingOfCourse = async(req, res) => {
    try{
        const courseId = req.body.courseId;
        const courseDetails = await Course.findById(courseId)
                                            .populate({
                                                path:"ratingAndReviews",
                                                populate: {
                                                    path: "user",
                                                    populate: {
                                                        path: "additionalDetails"
                                                    }
                                                }
                                            }).exec();

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "Course not found!"
            });
        }

        const allRatingReviews = courseDetails.ratingAndReviews;

        return res.status(200).json({
            success: true,
            message: "Fetched all rating and reviews.",
            data: allRatingReviews,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get all rating and reviews
exports.getAllRatingAndReviews = async(req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path: "user",
                                    select: "firstName lastName email image",
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName"
                                })
                                .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews are fetched successfully.",
            data: allReviews
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}