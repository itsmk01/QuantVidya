const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
const {passwordUpdated} = require("../mail-template/passwordUpdate");

//generateAccessTokenAndRefreshToken
const generateAccessAndRefereshTokens = async(userId) =>{
	try{
		const user = await User.findById(userId);

		const payload = {
			email: user.email,
			id: user._id,
			accountType: user.accountType,
    	};
        // Create Access & Refresh tokens
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: "15m", // short lifespan
		});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: "7d", // longer lifespan
		});

        user.refreshToken = refreshToken;
        await user.save();

        return {accessToken, refreshToken}
	} 
	catch (error) {
        return res.status(500).json({
			success: false,
			message: "Something went wrong during generating access and refresh"
		})
    }
}


//Signup
exports.signup = async (req,res) => {
    try{
        //get data
        const {firstName, lastName, email, password, confirmPassword, accountType} = req.body ;
        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType){
            return res.status(400).json({
                success: false,
                message: "Fill the form carefully !"
            })
        }

        //Match password
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password and ConfirmPassword doesn't match. Please try again !"
            })
        }

        //check user already exist or not
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User Already exist! Please Log in !"
            })
        }

        //Verification of otp
        const otpRecord = await Otp.findOne({email, purpose: "signup", verified: true }).sort({createdAt: -1});
        if (!otpRecord) {
            return res.status(404).json({ success: false, message: "OTP not verified" });
        }

        //password encryption
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        const additionalDetails = await Profile.create({
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
            gender: "Other",
            dateOfBirth: "",
            about: "",
            contactNumber: ""
        });

        //create entry for new user
        let user = await User.create({
            firstName, lastName, email, password: hashedPassword, accountType,
            additionalDetails: additionalDetails._id
        });

        return res.status(201).json({ 
            success: true, 
            message: "User created successfully ." 
        });

    }catch(err)
    {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong during sign up . Try again later!"
        });
    }
}


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please Sign Up!",
      });
    }

	

    if (await bcrypt.compare(password, user.password)) {
      // Create Access & Refresh tokens
      const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

	  const loggedInUser = await User.findById(user._id).select("-password -refreshToken").populate("additionalDetails").exec();
	  loggedInUser.password = undefined;
		const options = {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		}

      return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json({
          success: true,
          user: loggedInUser,
          accessToken,
          refreshToken,
          message: "User logged in successfully",
        });
    } else {
      return res.status(403).json({
        success: false,
        message: "Wrong Password!",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


// Logout
exports.logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        };

        // Just clear cookies, don't worry about database
        // (Expired/invalid tokens will be rejected anyway)
        return res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .status(200)
            .json({
                success: true,
                message: "Logged out successfully",
            });

    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

//Refresh Access Token
exports.refreshAccessToken = async (req, res) => {
  try {
    console.log("🔄 Refresh token endpoint called");
    
    const incomingRefreshToken = req.cookies.refreshToken;

    console.log("📝 Refresh token:", incomingRefreshToken ? "Present" : "Missing");

    if (!incomingRefreshToken) {
      console.log("❌ No refresh token in cookies");
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Verify refresh token
    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (jwtError) {
      console.log("❌ Refresh token verification failed:", jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    // Find user
    const user = await User.findById(decodedToken.id);

    if (!user) {
      console.log("❌ User not found for id:", decodedToken.id);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token - user not found"
      });
    }

    // Check if refresh token matches
    if (incomingRefreshToken !== user.refreshToken) {
      console.log("❌ Refresh token doesn't match database");
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or reused",
      });
    }

    // Generate new tokens
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        message: "Token refreshed successfully",
      });

  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
};


//change password
exports.changePassword = async (req, res) => {
    try{
        //Get data from req and validation
        const { currentPassword, newPassword, confirmPassword} = req.body;
        const userId = req.user.id;

        if( !currentPassword || !newPassword || !confirmPassword){
            return res.status(404).json({
                success: false,
                message: "All fields are required !"
            });
        }
        //check newpassword and confirmpassword
        if(newPassword !== confirmPassword){
            return res.status(404).json({
                success: false,
                message: "NewPassword and ConfirmPassword are not matching !"
            })
        }

        const user = await User.findById(userId);

        //password not matched
        if(!await bcrypt.compare(currentPassword, user.password)){
            return res.status(404).json({
                success: false,
                message: "Current Password is incorrect !"
            });
        }

        //password matched
        
        //New password encryption
        let newHashedPassword;
        try{
            newHashedPassword = await bcrypt.hash(newPassword, 10);
        }
        catch(e){
            return res.status(500).json({
                success: false,
                message: "Error in hassing new password !"
            });
        }

        //Update password in Db
        const updatedUser = await User.findByIdAndUpdate(userId,{password: newHashedPassword});

        //send email
        try{
          const mailResponse = await mailSender(updatedUser.email, 
                                                "Reg-Password Change", 
                                                passwordUpdated(updatedUser.email, updatedUser.firstName + " " + updatedUser.lastName));

           console.log("Mail Response for successfully changing password: ", mailResponse);
        }
        catch(e){
            return res.status(404).json({
                success: false,
                message: "Issue in sending the email !"
            })
        }

        res.status(200).json({
            success: true,
            message: "New Password updated successfully and email sent !"
        })


    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in changing the password !"
        });
    }
}