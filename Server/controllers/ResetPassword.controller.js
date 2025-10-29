const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail-template/passwordUpdate");
const { forgotPasswordLink } = require("../mail-template/forgotPasswordLink");

//Generating resetPassword Link 
exports.resetPasswordToken = async (req , res ) => {
    try{
        //fetch email
        const {email} = req.body;

        //check user, email validation
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Your email is not registered with us !"
            });
        }

        //generate token
        const token = crypto.randomUUID();

        //Update user in the database with token and resetPassword expire time
        const updatedDetail = await User.findOneAndUpdate(
                                                {email},
                                                {
                                                    token: token,
                                                    resetPasswordExpires: Date.now() + 5*60*1000
                                                },
                                                {new: true}
        );
        //create url
        const url = `http://localhost:3000/update-password/${token}`;

        //sending mail containing url
        await mailSender(email,
                        "Password Reset Link",
                        forgotPasswordLink(email, user.firstName + " " + user.lastName, url));
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Your reset password link is sent to your email. Please change your password !"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Issue in creating token to reset password ."
        })
    }
}

exports.resetPassword = async (req, res) => {
    try{
        //fetch data
        const {password, confirmPassword, token } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword doesn't match !"
            });
        }
        //get user details 
        const user = await User.findOne({token: token});

        //validation of token
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token in invalid !"
            });
        }
        //token time check
        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token is expired. Please regenerate the token !"
            });
        }

        //password encryption
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Issue in hashing reset password !"
            });
        }
        //Update user details in the Db
        const updatedUser = await User.findOneAndUpdate({token}, {password: hashedPassword}, {new: true});

        //send email
        try{
            const mailResponse = await mailSender(updatedUser.email, 
                                                "Reg-Password Change", 
                                                passwordUpdated(updatedUser.email, updatedUser.firstName + " " + updatedUser.lastName));
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Issue in sending the email !"
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Reset password successfull !"
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in reseting the password !"
        });
    }
}