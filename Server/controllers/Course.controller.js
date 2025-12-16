const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const CourseProgress = require("../models/CourseProgress")

const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary
} = require("../utils/imageUploader");

//create new course handler
exports.createCourse = async (req, res) => {
  //Start Session and create Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //fetch data
    const {
      courseName,
      courseDescription,
      price,
      category,
      tag,
      whatYouWillLearn,
      instructions,
      status,
    } = req.body;
    //fetch thumbnail from req files
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail ||
      !status ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required !",
      });
    }

    //check for instructor from fetching id from req.user which i had assigned in auth middleware
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId).session(session);

    //validation of instructor
    if (!instructorDetails) {
      return res.status(402).json({
        success: false,
        message: "Instructor details not found !",
      });
    }

    //check validation of category
    const categoryDetails = await Category.findById(category).session(session);
    if (!categoryDetails) {
      return res.status(403).json({
        success: false,
        message: "This category does not exist !",
      });
    }

    //Upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create entry for newCourse
    const newCourse = await Course.create(
      [
        {
          courseName: courseName,
          courseDescription: courseDescription,
          instructor: instructorDetails._id,
          whatYouWillLearn: whatYouWillLearn,
          price: price,
          thumbnail: thumbnailImage.secure_url,
          tag: tag,
          category: categoryDetails._id,
          instructions: instructions,
          status: status,
        },
      ],
      { session }
    );

    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: { courses: newCourse[0]._id },
      },
      { new: true, session }
    );

    //add the new course to the tag schema of Tag
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: { courses: newCourse[0]._id },
      },
      { new: true, session }
    );

    //Commit Transaction
    await session.commitTransaction();
    session.endSession();

    //return response
    return res.status(200).json({
      success: true,
      message: "New course created successfully !",
      data: newCourse[0],
    });
  } catch (error) {
    //Abort transaction
    await session.abortTransaction();
    session.endSession();

    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Course !",
      error: error.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  //Start Session and create Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //fetch course ID from request
    const { courseId } = req.body;

    //validation for courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required!",
      });
    }

    //fetch data
    const {
      courseName,
      courseDescription,
      price,
      category,
      tag,
      whatYouWillLearn,
      instructions,
      status,
    } = req.body;

    //fetch thumbnail from req files if provided
    const thumbnail = req.files?.thumbnailImage;

    //fetch the existing course
    const existingCourse = await Course.findById(courseId).session(session);

    //validation of course existence
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    //check for instructor authorization
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId).session(session);

    //validation of instructor
    if (!instructorDetails) {
      return res.status(402).json({
        success: false,
        message: "Instructor details not found!",
      });
    }

    //check if the instructor owns this course
    if (
      existingCourse.instructor.toString() !== instructorDetails._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course!",
      });
    }

    //prepare update object with only provided fields
    const updateData = {};

    if (courseName) updateData.courseName = courseName;
    if (courseDescription) updateData.courseDescription = courseDescription;
    if (price) updateData.price = price;
    if (tag) updateData.tag = tag;
    if (whatYouWillLearn) updateData.whatYouWillLearn = whatYouWillLearn;
    if (instructions) updateData.instructions = instructions;
    if (status) updateData.status = status;

    //handle category change if provided
    if (category && category !== existingCourse.category.toString()) {
      //validate new category
      const newCategoryDetails = await Category.findById(category).session(
        session
      );
      if (!newCategoryDetails) {
        return res.status(403).json({
          success: false,
          message: "This category does not exist!",
        });
      }

      //remove course from old category
      await Category.findByIdAndUpdate(
        { _id: existingCourse.category },
        {
          $pull: { courses: courseId },
        },
        { new: true, session }
      );

      //add course to new category
      await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: { courses: courseId },
        },
        { new: true, session }
      );

      updateData.category = category;
    }

    //handle thumbnail update if provided
    if (thumbnail) {
      //delete old thumbnail from cloudinary
      if (existingCourse.thumbnail) {
        //extract public_id from the existing thumbnail URL
        const publicId = `${process.env.FOLDER_NAME}/${
          existingCourse.thumbnail.split("/").pop().split(".")[0]
        }`;
        await deleteImageFromCloudinary(publicId);
      }

      //upload new thumbnail to cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updateData.thumbnail = thumbnailImage.secure_url;
    }

    //update the course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
      session,
    }).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      }
    }).exec();

    //Commit Transaction
    await session.commitTransaction();
    session.endSession();

    //return response
    return res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      data: updatedCourse,
    });
  } catch (error) {
    //Abort transaction
    await session.abortTransaction();
    session.endSession();

    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Course!",
      error: error.message,
    });
  }
};

//Get all courses handler
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        instructor: true,
        whatYouWillLearn: true,
        price: true,
        thumbnail: true,
        tag: true,
        category: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Return All Courses Successfull !",
      data: allCourses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Issue in showing the courses !",
      error: err.message,
    });
  }
};

//Get instructor specific courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const instructorCourses = await Course.find({ instructor: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "category",
        populate: {
          path: "courses",
          populate: [
            {
              path: "instructor",
              populate: {
                path: "additionalDetails",
              },
            },
            {
              path: "ratingAndReviews",
            },
          ],
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          populate: {
            path: "additionalDetails",
          }
        }
      })
      .exec();

    if (!instructorCourses || instructorCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this instructor !",
      });
    }

    const coursesWithDuration = instructorCourses.map((course) => {
      let totalDurationInSeconds = 0;

      course.courseContent.forEach((section) => {
        if (section.subSection && section.subSection.length > 0) {
          section.subSection.forEach((sub) => {
            const timeDurationInSeconds = parseInt(sub.timeDuration) || 0;
            totalDurationInSeconds += timeDurationInSeconds;
          });
        }
      });

      // const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
      const totalDuration = totalDurationInSeconds;

      // Return course with its duration
      return {
        ...course.toObject(), // Convert Mongoose document to plain object
        totalDuration,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Instructor courses fetched successfully !",
      data: coursesWithDuration,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Issue in showing the instructor courses !",
      error: error.message,
    });
  }
};

//delete course
exports.deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required!",
      });
    }

    // Fetch course with sections + subsections
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .populate("instructor") // needed to remove course from user
      .session(session);

    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    /* ---------------------------------------------------------
       DELETE THUMBNAIL (Outside transaction)
       --------------------------------------------------------- */
    if (course.thumbnail) {
      try {
        const publicId =
          `${process.env.FOLDER_NAME}/${course.thumbnail.split('/').pop().split('.')[0]}`;
        await deleteImageFromCloudinary(publicId);
      } catch (err) {
        console.error("Cloudinary thumbnail delete error:", err);
      }
    }

    /* ---------------------------------------------------------
       DELETE ALL VIDEO LECTURES (Outside transaction)
       --------------------------------------------------------- */
    let allSubsections = [];

    for (const section of course.courseContent) {
      for (const sub of section.subSection) {
        if (sub.videoUrl) {
          try {
            const publicId =
              `${process.env.FOLDER_NAME}/${sub.videoUrl.split('/').pop().split('.')[0]}`;

            await deleteVideoFromCloudinary(publicId);
          } catch (err) {
            console.error("Cloudinary video delete error:", err);
          }
        }
        allSubsections.push(sub._id);
      }
    }

    /* ---------------------------------------------------------
       DELETE SUBSECTIONS (Inside transaction)
       --------------------------------------------------------- */
    if (allSubsections.length > 0) {
      await SubSection.deleteMany(
        { _id: { $in: allSubsections } },
        { session }
      );
    }

    /* ---------------------------------------------------------
       DELETE SECTIONS (Inside transaction)
       --------------------------------------------------------- */
    const sectionIds = course.courseContent.map(s => s._id);

    if (sectionIds.length > 0) {
      await Section.deleteMany(
        { _id: { $in: sectionIds } },
        { session }
      );
    }

    /* ---------------------------------------------------------
       REMOVE COURSE FROM USER MODEL (Inside transaction)
       --------------------------------------------------------- */
    await User.findByIdAndUpdate(
      course.instructor._id,
      { $pull: { courses: courseId } }, // assuming User schema contains "courses" array
      { session }
    );

    /* ---------------------------------------------------------
       DELETE COURSE (Inside transaction)
       --------------------------------------------------------- */
    await Course.findByIdAndDelete(courseId, { session });

    /* ---------------------------------------------------------
       COMMIT THE TRANSACTION
       --------------------------------------------------------- */
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message:
        "Course, sections, subsections, thumbnail, videos, and user reference deleted successfully!",
    });

  } catch (err) {
    console.error("Error deleting course:", err);

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: err.message,
    });
  }
};


//Get course details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "category",
        populate: {
          path: "courses",
          populate: [
            {
              path: "instructor",
              populate: {
                path: "additionalDetails",
              },
            },
            {
              path: "ratingAndReviews",
            },
          ],
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          populate: {
            path: "additionalDetails",
          }
        }
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Couldn't find the course detials with this ${courseId} !`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course Details is fetched successfully.",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAuthenticatedFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Fetch course details with all populated fields
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "category",
        populate: {
          path: "courses",
          populate: [
            {
              path: "instructor",
              populate: {
                path: "additionalDetails",
              },
            },
            {
              path: "ratingAndReviews",
            },
          ],
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          populate: {
            path: "additionalDetails",
          },
        },
      })
      .exec();

    // Validate course exists
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Course not found with ID: ${courseId}`,
      });
    }

    // Calculate total lectures
    let totalLectures = 0;
    if (courseDetails.courseContent && courseDetails.courseContent.length > 0) {
      courseDetails.courseContent.forEach((section) => {
        if (section.subSection && Array.isArray(section.subSection)) {
          totalLectures += section.subSection.length;
        }
      });
    }

    // Fetch user's course progress
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    // Get completed lectures array (array of lecture IDs)
    const completedLectures = courseProgress?.completedVideos || [];

    // Calculate progress percentage
    const progressPercentage = totalLectures > 0 
      ? Math.round((completedLectures.length / totalLectures) * 100) 
      : 0;

    // Return response with course details and progress
    return res.status(200).json({
      success: true,
      message: "Authenticated course details fetched successfully",
      data: {
        courseDetails: courseDetails,
        totalLectures: totalLectures,
        completedLectures: completedLectures, // Array of completed lecture IDs
        progressPercentage: progressPercentage,
      },
    });

  } catch (error) {
    console.error("Error in getAuthenticatedFullCourseDetails:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course details",
      error: error.message,
    });
  }
};


exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and SubSection ID are required",
      });
    }

    // Validate if the subsection exists in the course
    const course = await Course.findById(courseId).populate("courseContent");
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if subsection exists in the course
    let subsectionExists = false;
    for (const section of course.courseContent) {
      if (section.subSection.includes(subSectionId)) {
        subsectionExists = true;
        break;
      }
    }

    if (!subsectionExists) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found in this course",
      });
    }

    // Check if already completed BEFORE updating
    const existingProgress = await CourseProgress.findOne({
      courseId: courseId,  // Changed from courseID to courseId
      userId: userId,
      completedVideos: subSectionId,
    });

    if (existingProgress) {
      return res.status(200).json({
        success: true,
        message: "Lecture was already marked as completed",
        data: existingProgress,
        isNewlyCompleted: false,
        alreadyCompleted: true,
      });
    }

    // Use $addToSet to safely add without duplicates
    const courseProgress = await CourseProgress.findOneAndUpdate(
      {
        courseId: courseId,  // Changed from courseID to courseId
        userId: userId,
      },
      {
        $addToSet: { completedVideos: subSectionId },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const isNewDocument = courseProgress.completedVideos.length === 1;

    return res.status(isNewDocument ? 201 : 200).json({
      success: true,
      message: isNewDocument
        ? "Course progress created and lecture marked as completed"
        : "Lecture marked as completed successfully",
      data: courseProgress,
      isNewlyCompleted: true,
    });

  } catch (error) {
    console.error("Error in updateCourseProgress:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating course progress",
      error: error.message,
    });
  }
};