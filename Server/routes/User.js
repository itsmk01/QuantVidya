const express = require("express");
const router = express.Router();

//Import Controllers
const {submitContactForm} = require("../controllers/ContactUs.controller");

//define route for contact us form submission
router.post("/contact-us/submit", submitContactForm);

module.exports = router;
