const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadVideoToCloudinary, deleteVideoFromCloudinary} = require("../utils/imageUploader");

//create subsection
exports.createSubSection = async (req, res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        //fetch data and video
        const {sectionId, title, description, additionalUrl} = req.body;
        const video = req.files.video;
        //validation
        if(!sectionId || !title  || !description || ! video){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }
        //upload video to cloudinary and get secure url
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
        // console.log("upload details....: ", uploadDetails);
        //create subsection
        const SubSectionDetails = await SubSection.create([{
            title: title,
            timeDuration: uploadDetails.duration,
            description: description,
            videoUrl: uploadDetails.secure_url,
            additionalUrl: additionalUrl
        }], {session});
        //update section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {$push: {subSection: SubSectionDetails[0]._id}},
                                                                {new: true})
                                                                .session(session)
                                                                .populate("subSection")
                                                                .exec();

        await session.commitTransaction();
        session.endSession();
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully !",
            data: updatedSection
        });

    }
    catch(err){
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating SubSection.",
            error: err.message
        });
    }
}

// update sub-section
exports.updateSubSection = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {sectionId, subSectionId, title,  description, additionalUrl } = req.body;
        const video = req.files?.video; // optional video

        if (!subSectionId && !sectionId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "sectionId or subSectionId is missing!"
            });
        }

        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
            success: false,
            message: "Sub section not found!"
            });
        }

        // prepare update object
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (additionalUrl) updateData.additionalUrl = additionalUrl;

        // if video is updated, upload and set new url
        if (video) {
            //old video delete karenge
            if (subSection.videoUrl) {
                // Extract public_id from the Cloudinary URL
                const publicId = `${process.env.FOLDER_NAME}/${subSection.videoUrl.split('/').pop().split('.')[0]}`;
                // Delete from Cloudinary
                await deleteVideoFromCloudinary(publicId);
            }

            //new video uploaded
            const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
            updateData.videoUrl = uploadDetails.secure_url;
            updateData.timeDuration = uploadDetails.duration;
        }

        // update sub-section
        const updatedSubSectionDetails = await SubSection.findByIdAndUpdate(
                                                                subSectionId,
                                                                { $set: updateData },
                                                                { new: true })
                                                                .session(session);

        //get the value of section
        const sectionDetails = await Section.findById(sectionId).session(session).populate("subSection").exec();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully!",
            data: sectionDetails
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: "Error in updating SubSection.",
            error: err.message
        });
    }
};


//delete sub-section
exports.deleteSubSection = async(req, res) => {
    try{
        //fetch data
        const {subSectionId, sectionId} = req.body;
        //validation
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Sub-section id and sectionId is required !"
            });
        }

        // check section
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
            success: false,
            message: "Section not found!"
            });
        }

        // check Sub section
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
            success: false,
            message: "Sub section not found!"
            });
        }

         if (subSection.videoUrl) {
            // Extract public_id from the Cloudinary URL
           const publicId = `${process.env.FOLDER_NAME}/${subSection.videoUrl.split('/').pop().split('.')[0]}`;
            // Delete from Cloudinary
            await deleteVideoFromCloudinary(publicId);
        }

        //remove sub-section reference from section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {$pull: { subSection: subSectionId}},
                                                                {new: true}
                                                            )
                                                            .populate("subSection")
                                                            .exec();
        
            
        //delete from db
        await SubSection.findByIdAndDelete(subSectionId);

        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully !",
            data: updatedSection
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in deleting SubSection."
        });
    }
}