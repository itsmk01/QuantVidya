const ContactUs = require("../models/ContactUs");

//handle contact us form submission
exports.submitContactForm = async (req, res) => {
    try{
        console.log("Contact Us Form Data - ", req.body);
        //fetch data
        const {firstName, lastName, email, phoneNumber, message} = req.body;
        
        //validation
        if(!firstName || !lastName || !email || !phoneNumber || !message){
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }

        const user = await ContactUs.findOne({email: email});
        if(user && user.resolved === false){
            return res.status(400).json({
                success: false,
                message: "You have already submitted a query. Our team will get back to you soon. Thank you!"
            });
        }

        //create new contact us entry
        const newContactUsEntry = new ContactUs({
            firstName,
            lastName,
            email,
            phoneNumber,
            message
        });
        await newContactUsEntry.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "Contact form submitted successfully !"
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Error submitting contact form",
            error: error.message
        });
    }
}