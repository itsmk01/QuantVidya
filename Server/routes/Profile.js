const express = require("express");
const router = express.Router();

const {updateProfile, deleteAccount, getUserDetails, getAllUsers, getInstructorData} = require("../controllers/Profile.controller");
const { auth, isInstructor } = require("../middlewares/auth");


router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getUserDetails", auth , getUserDetails);
router.get("/getAllUsers", getAllUsers)
router.get("/getInstructorData", auth , isInstructor, getInstructorData);

module.exports = router;