const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("..//models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

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

        const user = await User.findById(userId)
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
        //get id
        const userId = req.user.id;
        const user = await User.findById(userId).session(session);

        //validation
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found !"
            });
        }

        //Remove user from all enrolled courses
        await Course.updateMany(
            {studentEnrolled: userId},
            {$pull: {studentEnrolled: userId}},
            {session}
        );

        //delete Profile
        const additionalDetailsId = user.additionalDetails;
        await Profile.findByIdAndDelete({_id:additionalDetailsId}, {session});

        //delete User
        await User.findByIdAndDelete(userId, {session});

        await session.commitTransaction();
        await session.endSession();
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Account is deleted successfully !"
        });

    }
    catch(err){
        await session.abortTransaction();
        await session.endSession();
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error during deleting the Account !"
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