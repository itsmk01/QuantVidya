const express = require("express");
const router = express.Router();

//Import Controllers
const {login, signup, changePassword, logout} = require("../controllers/Auth.controller");
const {sendOtp, verifyOtp} = require("../controllers/Otp.controller");
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword.controller");


//define routes for login , signup and authentication
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/change-password", auth, changePassword)


router.post("/reset-password-token", resetPasswordToken);
router.put("/reset-password", resetPassword);


module.exports = router;