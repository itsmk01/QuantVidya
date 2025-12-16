const express = require("express");
const router = express.Router();

const { auth, isInstructor , isStudent, isAdmin} = require("../middlewares/auth");
const { createCourse, getAllCourses, getFullCourseDetails, editCourse, getInstructorCourses, deleteCourse, 
            getAuthenticatedFullCourseDetails, updateCourseProgress } = require("../controllers/Course.controller");
const { createSection, updateSection, deleteSection } = require("../controllers/Section.controller");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection.controller");
const { createRating, getAverageRating, getAllRatingOfCourse, getAllRatingAndReviews } = require("../controllers/RatingAndReviews.controller");
const { createCategory, getAllCategory, categoryPageDetails } = require("../controllers/Category.controller");


//Course, section and sub-section routes
router.post("/createCourse", auth, isInstructor, createCourse);
router.put("/editCourse", auth, isInstructor, editCourse);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection );
router.delete("/deleteSection", auth, isInstructor, deleteSection);
router.post("/addSubSection", auth , isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth , isInstructor, deleteSubSection);
router.get("/getAllCourses", getAllCourses);
router.get("/getFullCourseDetails/:courseId", getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.post("/getAuthenticatedFullCourseDetails", auth,isStudent, getAuthenticatedFullCourseDetails);
router.post("/updateCourseProgress" , auth, isStudent, updateCourseProgress);

//Routes for rating and review
router.post("/createRating", auth , isStudent , createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingAndReviewOfCourse", getAllRatingOfCourse);
router.get("/getAllRatingAndReviews", getAllRatingAndReviews);

//create category by admin
router.post("/createCategory", auth , isAdmin, createCategory);
router.get("/getAllCategories", getAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;