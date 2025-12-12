const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const RatingAndReview = require("../models/RatingAndReviews");
const { uploadImageToCloudinary, deleteImageFromCloudinary, deleteVideoFromCloudinary } = require("../utils/imageUploader");
const bcrypt = require("bcrypt");

//create profile

exports.updateProfile = async(req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // Safely destructure with default empty object
        const {firstName, lastName, gender, dateOfBirth, about, contactNumber} = req.body || {}
        const profilePic = req.files?.profilePic
        const userId = req.user.id

        if(!userId){
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({
                success: false,
                message: "UserId is required!"
            })
        }

        const user = await User.findById(userId).populate("additionalDetails").session(session).exec();
        if(!user){
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        const additionalDetailsId = user.additionalDetails

        // Build update object dynamically
        const updateData = {}
        if (gender !== undefined) updateData.gender = gender
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth
        if (contactNumber !== undefined) updateData.contactNumber = contactNumber
        if (about !== undefined) updateData.about = about
        
        // Upload profile picture if provided
        if(profilePic){
            //delete existing image from cloudinary
            if(user.additionalDetails.image){
                try{
                    const publicId = `${process.env.FOLDER_NAME}/${user.additionalDetails.image.split('/').pop().split('.')[0]}`;
                    await deleteImageFromCloudinary(publicId);
                }catch(err){
                    console.error("Error deleting profile image from cloudinary:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Error deleting profile image from cloudinary!",
                        error: err.message
                    });
                }
            }
            //upload new image
            const uploadDetails = await uploadImageToCloudinary(
                profilePic, 
                process.env.FOLDER_NAME
            )
            updateData.image = uploadDetails.secure_url
        }

        // Only update additional details if there's something to update
        if(Object.keys(updateData).length > 0) {
            await Profile.findByIdAndUpdate(
                additionalDetailsId,
                {$set: updateData},
                {new: true, session}
            )
        }

        // Update user basic info
        if(firstName !== undefined) user.firstName = firstName
        if(lastName !== undefined) user.lastName = lastName
        
        // Only save if user data was modified
        if(firstName !== undefined || lastName !== undefined) {
            await user.save({session})
        }

        await session.commitTransaction()
        session.endSession()

        // IMPORTANT: Fetch fresh data AFTER transaction
        const updatedUser = await User.findById(userId)
            .populate("additionalDetails")
            .select("-password")  // Don't send password
            .lean()  // Convert to plain object
            .exec()

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully!",
        })

    } catch(err) {
        await session.abortTransaction()
        session.endSession()

        console.error("Profile Update Error:", err)
        return res.status(500).json({
            success: false,
            message: "Error updating profile!",
            error: err.message
        })
    }
}


//delete User
exports.deleteAccount = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        //get id and password from request
        const userId = req.user.id;
        const { password } = req.body;

        //validation - check if password provided
        if(!password){
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account!"
            });
        }

        const user = await User.findById(userId).session(session).populate("additionalDetails").exec();
        
        //validation - check if user exists
        if(!user){
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        //verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            await session.abortTransaction();
            await session.endSession();
            return res.status(401).json({
                success: false,
                message: "Incorrect password!"
            });
        }

        //Delete user's image from cloudinary if exists
        if(user.additionalDetails.image){
            try{
                const publicId = `${process.env.FOLDER_NAME}/${user.additionalDetails.image.split('/').pop().split('.')[0]}`;
                await deleteImageFromCloudinary(publicId);
            }catch(err){
                console.error("Error deleting profile image from cloudinary:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error deleting profile image from cloudinary!",
                    error: err.message
                });
            }
            
        }

        //Get user's courses where they are instructor
        const instructorCourses = await Course.find({instructor: userId}).session(session).populate({
                                                                                                path: "courseContent",
                                                                                                populate: {
                                                                                                    path: "subSection",
                                                                                                }
                                                                                            }).exec();
        
        //Delete all course thumbnails and content from cloudinary
        for(const course of instructorCourses){
            if(course.thumbnail){
                try{
                    const publicId = `${process.env.FOLDER_NAME}/${course.thumbnail.split('/').pop().split('.')[0]}`;
                    await deleteImageFromCloudinary(publicId);
                }catch(err){
                    console.error("Error deleting course thumbnail from cloudinary:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Error deleting course thumbnail from cloudinary!",
                        error: err.message
                    });
                }
                
            }
            
            //Delete course sections and subsections
            for(const section of course.courseContent){
                if(section){
                    //Delete subsection videos from cloudinary
                    for(const subsection of section.subSection){
                        if(subsection && subsection.videoUrl){
                            try{
                                const publicId = `${process.env.FOLDER_NAME}/${subsection.videoUrl.split('/').pop().split('.')[0]}`;
                                await deleteVideoFromCloudinary(publicId);
                            }catch(err){
                                console.error("Error deleting course videos from cloudinary:", err);
                                return res.status(500).json({
                                    success: false,
                                    message: "Error deleting course videos from cloudinary!",
                                    error: err.message
                                });
                            }
                            
                        }
                        await SubSection.findByIdAndDelete(subsection._id, {session});
                    }
                    await Section.findByIdAndDelete(section._id, {session});
                }
            }
            
            //Delete the course
            await Course.findByIdAndDelete(course._id, {session});
        }

        //Remove user from all enrolled courses (as student)
        await Course.updateMany(
            {studentsEnrolled: userId},
            {$pull: {studentsEnrolled: userId}},
            {session}
        );

        //Delete user's course progress
        await CourseProgress.deleteMany({userId: userId}, {session});

        //Delete user's rating and reviews
        await RatingAndReview.deleteMany({user: userId}, {session});

        //Delete Profile
        const additionalDetailsId = user.additionalDetails;
        if(additionalDetailsId){
            await Profile.findByIdAndDelete(additionalDetailsId, {session});
        }

        //Delete User
        await User.findByIdAndDelete(userId, {session});

        await session.commitTransaction();
        await session.endSession();
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully!"
        });

    }
    catch(err){
        await session.abortTransaction();
        await session.endSession();
        console.error("Error during account deletion:", err);
        return res.status(500).json({
            success: false,
            message: "Error during deleting the account!",
            error: err.message
        });
    }
}



//get user all details
exports.getUserDetails = async(req, res) => {
    try{
        //get userId 
        const userId = req.user.id;

        //get details from db
        const userdetails = await User.findById(userId).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully !",
            userdetails
        });

    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Error during fetching user details !",
        });
    }
}

//get all users
exports.getAllUsers = async(req, res) => {
    try{
        const users = await User.find().populate("additionalDetails").exec();
        return res.status(200).json({
            success: true,
            message: "All users fetched successfully !",
            users
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Error during fetching all users !",
        });
    }
}

//get instructor data
exports.getInstructorData = async (req, res) => {
  try {
    const instructorId = req.user.id; // comes from auth middleware

    // Fetch instructor details
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Fetch all courses created by instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate("studentEnrolled").exec();

    let totalStudents = 0;
    let totalIncome = 0;

    // Calculating stats
    courses.forEach((course) => {
      const enrolled = course.studentsEnrolled?.length || 0;
      totalStudents += enrolled;
      totalIncome += enrolled * (course.price || 0);
    });

    return res.status(200).json({
      success: true,
      data: {
        instructorName: instructor.firstName + " " + instructor.lastName,
        totalCourses: courses.length,
        totalStudents,
        totalIncome,
        courses,  // you can remove this if not required
      },
    });

  } catch (error) {
    console.log("Error in Instructor Dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching instructor dashboard data",
    });
  }
};

//get user enrolled courses
exports.getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found!",
      });
    }

    // Fetch user with enrolled courses
    const user = await User.findById(userId)
      .populate({
        path: "courses", // enrolled courses
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: user.courses,
      message: "Enrolled courses fetched successfully",
    });

  } catch (error) {
    console.log("Error fetching enrolled courses:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enrolled courses",
      error: error.message,
    });
  }
};

