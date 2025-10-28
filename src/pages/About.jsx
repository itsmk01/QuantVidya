import React from "react";
import ColourText from "../components/core/HomePage/ColourText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponenet from "../components/core/AboutPage/StatsComponent";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/core/HomePage/Footer";

const About = () => {
  return (
    <div>
      {/* Section 1 */}
      <section>
        <div className="bg-richblack-700 relative flex flex-col gap-16 lg:pb-60 pb-12">
          <div className=" lg:mt-16 mt-8 flex flex-col gap-4 items-center text-center">
            <p className="w-10/12 max-w-[750px] mx-auto lg:text-4xl text-3xl text-white font-bold font-inter">
              Driving Innovation in Online Education for a{" "}
              <ColourText text={"Brighter Future"} />
            </p>
            <p className="w-11/12 max-w-[820px] mx-auto text-richblack-200 text-center font-inter font-bold lg:mb-6">
              QuantVidya is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </div>
          <div
            className="w-11/12 max-w-[1260px] mx-auto lg:absolute lg:bottom-0 lg:left-[50%] grid lg:translate-x-[-50%] 
		  				lg:translate-y-[30%] lg:grid-cols-3 grid-cols-1 gap-3 lg:gap-5 place-items-center"
          >
            <img src={BannerImage1} alt="" />
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <div className="mb-10 border-b border-richblack-700">
        <p
          className="w-11/12 max-w-[1260px] mx-auto lg:text-4xl text-3xl text-white font-bold font-inter lg:mt-44 mt-20 
					mb-20 text-center"
        >
          We are passionate about revolutionizing the way we learn. Our
          innovative platform <ColourText text={"combines technology"} />,
          <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
            expertise
          </span>
          , and community to create an{" "}
          <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
            unparalleled educational experience.
          </span>
        </p>
      </div>

	  {/* Section 3 */}
	  <section>
        <div className="w-11/12 max-w-[1260px] mx-auto flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
              Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
    </section>

	  <StatsComponenet />

	  {/* Section 4 */}
	  <section className="mx-auto mt-20 flex w-11/12 max-w-[1260px] flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

	  <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
        {/* <ReviewSlider /> */}
      </div>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default About;
