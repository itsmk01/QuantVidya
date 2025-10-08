const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");

//create Section
exports.createSection = async(req , res) => {

    //create transaction
    const session = await mongoose.startSession()
    session.startTransaction();

    try{
        //fetch data
        const {sectionName, courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fiels are required !"
            });
        }
        //create entry in db
        const newSection = await Section.create([{sectionName}], {session});

        //update in course schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
                                                                    {
                                                                        $push: {courseContent: newSection[0]._id}
                                                                    }, 
                                                                    {new: true, session})
                                                                    .populate("courseContent")
                                                                    .exec();

        //commit transaction
        await session.commitTransaction();
        session.endSession();

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully !",
            updatedCourseDetails
        })

    }
    catch(err){
        //abord transaction
        await session.abortTransaction();
        session.endSession();

        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error in creating section",
            error: err.message
        });
    }
}

//update section
exports.updateSection = async(req , res) => {
    try{
        //fetch data
        const {sectionName, sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fiels are required !"
            });
        }
        
        //create entry in db
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$set:{sectionName}}, {new:true});

        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully !",
            updatedSection
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating section",
            error: err.message
        });
    }
}

//delete section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required!"
      });
    }

    // check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!"
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

    // optional: delete all subSections inside this section
    if (section.subSection && section.subSection.length > 0) {
      await SubSection.deleteMany({ _id: { $in: section.subSection } });
    }

    // remove section reference from course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    // delete section
    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully!"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error in deleting section",
      error: err.message
    });
  }
};
