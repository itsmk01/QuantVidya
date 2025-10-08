const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");


//capture the payment and initiate the razorpay payment
exports.capturePayment = async (req , res) => {

    //get courseId and userId 
    const {courseId} = req.body;
    const userId = req.user.id;

    //validation 
    //validate courseId
    if(!courseId){
        return res.status(404).json({
            success: false,
            message: "Please provide valid course id !"
        });
    }
    //validate courseDetails
    let course;
    try{
        course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                success: false,
                message: "Could not find the course !"
            });
        }
        
        //convert the string userId into ObjectId 
        const uid = new mongoose.Types.ObjectId(String(userId));
        
        //check user already paided for the same course
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student already enrolled !"
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in finding course details !",
            error: err.message
        });
    }
    
    
    //order create 
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId,
            userId
        }
    };

    try{
        //initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            amount: paymentResponse.amount,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            message: "Payment initiated successfully !"
        });
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Couldn't initiate the payment !"
        });
    }
    
}


//Verify signature of Razorpay and Server
exports.verifyPayment = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    //3 steps to convert the webhook secret to digest for matching the signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    //Match signature and digest
    if(signature === digest){
        console.log("Payment is authorised !");

        //get courseId and userId from Razorpay reqest body
        const {courseId, userId} = req.body.payload.payment.entity.notes;

        //fulfill the action
        try{
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                                                                {_id: courseId},
                                                                {$push: {studentEnrolled: userId}},
                                                                {new: true}
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found !"
                });
            }
            console.log(enrolledCourse);

            //find the user and add the course
            const enrolledStudent = await User.findByIdAndUpdate(
                                                                {_id: userId},
                                                                {$push: {courses: courseId}},
                                                                {new: true}
            );

            //Send email for the confirmation
            const emailResponse = await mailSender(
                                                studentEnrolled.email,
                                                "Congratulation from QuantVidya",
                                                "Congratulation, You have successfully enrolled in the new course !"
            );

            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature verified and course added successfully !"
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request !"
        });
    }
}

//sent payment success email
