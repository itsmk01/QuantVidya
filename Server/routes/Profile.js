const express = require("express");
const router = express.Router();

const {updateProfile, deleteAccount, getUserDetails, getAllUsers, getInstructorData, getUserEnrolledCourses} = require("../controllers/Profile.controller");
const { auth, isInstructor, isStudent } = require("../middlewares/auth");


router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getUserDetails", auth , getUserDetails);
router.get("/getAllUsers", getAllUsers);
router.get("/getInstructorData", auth , isInstructor, getInstructorData);
router.get("/enrolled-courses", auth, isStudent, getUserEnrolledCourses);

module.exports = router;