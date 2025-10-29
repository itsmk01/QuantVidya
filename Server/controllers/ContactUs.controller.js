const ContactUs = require("../models/ContactUs");
const mailSender = require("../utils/mailSender");
const { contactUsEmail} = require("../mail-template/contactFormRes");

// Handle contact us form submission
exports.submitContactForm = async (req, res) => {
    try {
        console.log("=== Contact Us Form Submission ===");
        
        // Fetch data
        const { firstName, lastName, email, phoneNumber, message } = req.body;
        
        // Validation
        if (!firstName || !email || !phoneNumber || !message) {
            return res.status(400).json({
                success: false,
                message: "First name, email, phone number, and message are required!"
            });
        }

        // Check for existing entry with this email
        const existingEntry = await ContactUs.findOne({ email: email });
        
        if (existingEntry) {
            // If there's an unresolved query, prevent new submission
            if (existingEntry.resolved === false) {
                return res.status(400).json({
                    success: false,
                    message: "You have already submitted a query. Our team will get back to you soon. Thank you!"
                });
            }
            
            // If previous query was resolved, update it with new information
            const updatedEntry = await ContactUs.findByIdAndUpdate(
                existingEntry._id,
                {
                    firstName,
                    lastName: lastName || "",
                    phoneNumber,
                    message,
                    resolved: false,
                    resolvedAt: null,
                    resolvedBy: null
                },
                { new: true } // Returns the updated document
            );

            //send email
            try{
                const mailResponse = await mailSender(email, 
                                                    "Reg-Contact Form Submission", 
                                                    contactUsEmail(email, firstName, lastName, phoneNumber, message));
            }
            catch(e){
                console.log(e);
                return res.status(500).json({
                    success: false,
                    message: "Issue in sending the email !"
                })
            }
                        
            return res.status(200).json({
                success: true,
                message: "Thank you for contacting us again! We will get back to you soon.",
                data: {
                    id: updatedEntry._id,
                    isUpdate: true
                }
            });
        }
        
        // No existing entry found - create new one
        const newContactUsEntry = new ContactUs({
            firstName,
            lastName: lastName || "",
            email,
            phoneNumber,
            message,
            resolved: false
        });
        
        const savedEntry = await newContactUsEntry.save();

        try{
            const mailResponse = await mailSender(email, 
                                                "Reg-Contact Form Submission", 
                                                contactUsEmail(email, firstName, lastName, phoneNumber, message));
        }
        catch(e){
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Issue in sending the email !"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Thank you for contacting us! We will get back to you soon.",
            data: {
                id: savedEntry._id,
                isUpdate: false
            }
        });

    } catch (error) {
        console.error("=== Error in submitContactForm ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }
        
        // Handle duplicate key errors (if unique index still exists)
        if (error.code === 11000) {
            console.log("Duplicate key error - unique index on email field detected");
            return res.status(400).json({
                success: false,
                message: "An entry with this email already exists. Please contact support."
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Error submitting contact form. Please try again later.",
            error: error.message
        });
    }
}