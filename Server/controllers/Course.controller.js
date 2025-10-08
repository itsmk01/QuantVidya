const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create new course handler
exports.createCourse = async (req , res) => {

    //Start Session and create Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag, categoryId} = req.body;
        //fetch thumbnail from req files
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !categoryId || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }

        //check for instructor from fetching id from req.user which i had assigned in auth middleware
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId).session(session);

        //validation of instructor
        if(!instructorDetails){
            return res.status(400).json({
                success: false,
                message: "Instructor details not found !"
            });
        }

        //check validation of category
        const categoryDetails = await Category.findById(categoryId).session(session);
        if(!categoryDetails){
            return res.status(400).json({
                success: false,
                message: "This category does not exist !"
            });
        }

        //Upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create entry for newCourse
        const newCourse = await Course.create([{
                                            courseName: courseName,
                                            courseDescription: courseDescription,
                                            instructor: instructorDetails._id,
                                            whatYouWillLearn: whatYouWillLearn,
                                            price: price,
                                            thumbnail: thumbnailImage.secure_url,
                                            tag: tag,
                                            category: categoryDetails._id
                                            }],
                                            {session});

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
                                    {_id: instructorDetails._id},
                                    {
                                        $push: {courses: newCourse[0]._id}
                                    },
                                    {new: true, session}
        );

        //add the new course to the tag schema of Tag
        await Category.findByIdAndUpdate(
                                        {_id: categoryDetails._id},
                                        {
                                            $push: {courses: newCourse[0]._id}
                                        },
                                        {new: true, session}
        );

        //Commit Transaction
        await session.commitTransaction();
        session.endSession();

        //return response
        return res.status(200).json({
            success: true,
            message: "New course created successfully !",
            data: newCourse
        });

    }
    catch(error){
        //Abort transaction
        await session.abortTransaction();
        session.endSession();

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Course !",
            error: error.message
        });
    }
}


//Get all courses handler
exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({},
                                             {
                                                courseName: true,
                                                courseDescription: true,
                                                instructor: true,
                                                whatYouWillLearn: true,
                                                price: true,
                                                thumbnail: true,
                                                tag: true,
                                                category: true
                                             }
                                            ).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Return All Courses Successfull !",
            data: allCourses
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Issue in showing the courses !",
            error: err.message
        });
    }
}


//Get course details
exports.getCourseDetails = async (req, res) => {
    try{
        const {courseId} = req.params;
        console.log(courseId);
        const courseDetails = await Course.findById(courseId)
                                            .populate("category")
                                            .populate({
                                                path: "courseContent",
                                                populate: {
                                                    path: "subSection"
                                                }
                                            })
                                            .populate({
                                                path: "instructor",
                                                populate: {
                                                    path:"additionalDetails"
                                                }
                                            })
                                            .populate("ratingAndReviews")
                                            .exec();

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Couldn't find the course detials with this ${courseId} !`,
            });
        }
                
        return res.status(200).json({
            success: true,
            message: "Course Details is fetched successfully.",
            data: courseDetails
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