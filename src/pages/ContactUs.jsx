import React from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaEarthAsia } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import ContactUsForm from "../components/core/ContactUsPage/ContactUsForm";
import Footer from "../components/core/HomePage/Footer"

const contactUsData = [
  {
    icon: <HiChatBubbleLeftRight />,
    heading: "Chat on us",
    para1: "Our friendly team is here to help.",
    para2: "info@quantvidya.com",
  },
  {
    icon: <FaEarthAsia />,
    heading: "Visit us",
    para1: "Come say hello at our office HQ.",
    para2: "1234 Street Name, City, State, Country",
  },
  {
    icon: <IoCall />,
    heading: "Call us",
    para1: "Mon - Fri From 8am to 5pm",
    para2: "+91 12345 67890",
  },
];

const ContactUs = () => {
  return (
    <div>
      <div className="w-11/12 max-w-[1260px] mx-auto flex lg:flex-row flex-col gap-10 mt-20 mb-20">
        {/* left side */}
        <div className="lg:w-[40%] w-full h-fit p-8 border border-richblack-700 rounded-lg bg-richblack-800 flex flex-col gap-12">
          {contactUsData.map((item, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="text-richblack-5 flex items-center gap-2 text-xl font-inter font-semibold">
                <div>{item.icon}</div>
                <div>{item.heading}</div>
              </div>
              <div className="text-richblack-300 flex-col font-inter text-sm font-semibold">
                <p>{item.para1}</p>
                <p>{item.para2}</p>
              </div>
            </div>
          ))}
        </div>
        {/* right side */}
        <div className="lg:w-[60%] w-full h-fit lg:p-12 p-8 border border-richblack-700 rounded-lg flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-richblack-5 text-4xl font-inter font-semibold">Got a Idea? We've got the skills. Let's team up</h1>
            <p className="text-richblack-300 flex-col font-inter text-base font-semibold">Tell us more about yourself and what you're got in mind.</p>
          </div>
          <ContactUsForm />
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
