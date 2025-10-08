const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create subsection
exports.createSubSection = async (req, res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        //fetch data and video
        const {sectionId, title, timeDuration, description, additionalUrl} = req.body;
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || ! video){
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }
        //upload video to cloudinary and get secure url
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create subsection
        const SubSectionDetails = await SubSection.create([{
            title: title,
            timeDuration: timeDuration,
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
            updatedSection
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
    try {
        const { subSectionId, title, timeDuration, description, additionalUrl } = req.body;
        const video = req.files?.videoFile; // optional video

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId is required!"
            });
        }

        // prepare update object
        const updateData = {};
        if (title) updateData.title = title;
        if (timeDuration) updateData.timeDuration = timeDuration;
        if (description) updateData.description = description;
        if (additionalUrl) updateData.additionalUrl = additionalUrl;

        // if video is updated, upload and set new url
        if (video) {
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            updateData.videoUrl = uploadDetails.secure_url;
        }

        // update sub-section
        const updatedSubSectionDetails = await SubSection.findByIdAndUpdate(
            subSectionId,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully!",
            data: updatedSubSectionDetails
        });
    } catch (err) {
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
            updatedSection
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