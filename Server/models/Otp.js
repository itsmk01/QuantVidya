const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailVerificationTemplate = require("../mail-template/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,  // allows faster search, no duplicate restriction
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "login", "forgotPassword", "emailChange"],
    required: true,
  },
  verified: { 
        type: Boolean,
        default: false,
    },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5*60*1000, // document auto-deletes after 300 seconds (5 mins)
  },
});

// Add the unique composite index
otpSchema.index({ email: 1, otp: 1 }, { unique: true });


//A function to send Mail
async function sendVerificationEmail(email, otp) {
  try
  {
    let mailResponse = await mailSender(email, 
                                        "Email Verification Code: ", 
                                        emailVerificationTemplate(otp));
    // console.log("Mail sent successfully ", mailResponse);
  }
  catch(error)
  {
    console.log("Issue in sending email ", error)
  }
}

otpSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next(); 
})

// TTL index will automatically delete OTP after expiry
module.exports = mongoose.model("Otp", otpSchema);
