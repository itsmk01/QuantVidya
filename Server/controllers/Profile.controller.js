const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("..//models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create profile

exports.updateProfile = async(req, res) => {
    try{
        //fetch data
        const {gender, dateOfBirth, about, contactNumber} = req.body;
        const profilePic = req.files.profilePic;
        const userId = req.user.id;

        //validation
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "UserId is required !"
            });
        }

        //find userdetails
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User is not found !"
            });
        }
        const additionalDetailsId = user.additionalDetails;

        // build update object dynamically
        const updateData = {};
        if (gender) updateData.gender = gender;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (about) updateData.about = about;
        
        //if profilePic then upload
        let uploadDetails;
        if(profilePic){
            uploadDetails = await uploadImageToCloudinary(profilePic, process.env.FOLDER_NAME);
            updateData.image = uploadDetails.secure_url;
        }

        //update profile
        const updatedAdditionalDetails = await Profile.findByIdAndUpdate(
            additionalDetailsId,
            {$set: updateData},
            {new: true}
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully !",
        });

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error in creating Profile !"
        });
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