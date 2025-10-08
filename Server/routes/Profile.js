const express = require("express");
const router = express.Router();

const {updateProfile, deleteAccount, getUserDetails, getAllUsers} = require("../controllers/Profile.controller");
const { auth } = require("../middlewares/auth");


router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount", auth, deleteAccount);
router.get("/getUserDetails", auth , getUserDetails);
router.get("/getAllUsers", getAllUsers)

module.exports = router;