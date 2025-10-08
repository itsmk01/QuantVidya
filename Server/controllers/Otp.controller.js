const Otp = require("../models/Otp");
const User = require("../models/User");
const crypto = require("crypto");

// sendOtp
exports.sendOtp = async (req, res) => {
    try {
        const { email, purpose } = req.body;
        if (!email || !purpose) {
            return res.status(400).json({ 
                success: false,
                message: "Email and purpose are required!"
            });
        }

        // check based on purpose
        if (purpose === "signup") {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists! Please log in."
                });
            }
        } 
        else if (purpose === "login" || purpose === "forgotPassword") {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!" 
                });
            }
        }

        // generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        await Otp.create({ email, otp, purpose });

        res.status(200).json({
            success: true, message: `OTP sent for ${purpose}`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false, message: "Server issue. Try again later!"
        });
    }
};


//verifyOtp
exports.verifyOtp = async (req,res) => {
    try{

        const {email, otp, purpose} = req.body;
        if(!email || !otp || !purpose){
            return res.status(400).json({
                success: false,
                message: "Fill the form carefully !"
            })
        }

        const otpRecord = await Otp.findOne({email, purpose}).sort({createdAt: -1});

        if (!otpRecord) {
        return res.status(404).json({
            success: false,
            message: `OTP not found for ${purpose} !`
        });
        }

        if(otpRecord.otp !== otp ){
            return res.status(404).json({
                success: false,
                message: "Invalid Otp !"
            })
        }
        // TTL index auto-deletes expired OTPs, but MongoDb delete entry after some minute:
        const otpAge = Date.now() - new Date(otpRecord.createdAt).getTime();
        if (otpAge > 5 * 60 * 1000) {
            return res.status(400).json({ success: false, message: "OTP expired!" });
        }   

        //Mark OTP as verified
        await Otp.findOneAndUpdate({_id: otpRecord._id},{verified: true},{new:true});

        res.status(200).json({
            success: true,
            message: "Otp verified successfully !"
        })

    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server issue. Fail in verifying otp. Try again later!"
        })
    }
}