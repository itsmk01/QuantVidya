const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");


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
exports.login = async (req,res) => {
    try
    {
        //fetch data
        const {email,password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message : "Please fill all the details carefully",
            })
        }

        // check for registerd user 
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User does not exist. Please Sign Up !",
            });
        }

        // Verify password & generate a JWT token

        const payload = {
            email : user.email,
            id : user._id,
            accountType : user.accountType,
        };


        if(await bcrypt.compare(password,user.password)){
            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn : "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() +  2 * 60 * 60 * 1000),
                httpOnly : true,
                secure: true,
                sameSite: "None",
            }

            res.cookie("token",token,options).status(200).json({
                success : true,
                user,
                message:"User logged in successfully"
            });
        }
        else {
            // password not match
            return res.status(403).json({
                success : false,
                message : "Wrong Password !",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false" 
        })
    }
}

// Logout
exports.logout = async (req, res) => {
    try {
        // Clear the cookie named "token"
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,   // keep this true in production (HTTPS)
            sameSite: "None"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};


//change password
exports.changePassword = async (req, res) => {
    try{
        //Get data from req and validation
        const {email, oldPassword, newPassword, confirmPassword} = req.body;
        if(!email || !oldPassword || !newPassword || !confirmPassword){
            return res.status(401).json({
                success: false,
                message: "All fields are required !"
            });
        }
        //check newpassword and confirmpassword
        if(newPassword !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "NewPassword and ConfirmPassword are not matching !"
            })
        }

        const user = await User.findOne({email});

        //password not matched
        if(!await bcrypt.compare(oldPassword, user.password)){
            return res.status(401).json({
                success: false,
                message: "Old Password is incorrect !"
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
        await User.findOneAndUpdate({email},{password: newHashedPassword});

        //send email
        try{
            await mailSender(email, "Reg-Password Change", "Your password is changed successfully !");
        }
        catch(e){
            return res.status(401).json({
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