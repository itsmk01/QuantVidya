import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowCircleRight } from "react-icons/fa";

import Banner from '../assets/Images/banner.mp4'

import ColourText from '../components/core/HomePage/ColourText';
import CTAButton from '../components/core/HomePage/Button';
import Codeblock from '../components/core/HomePage/Codeblock';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import SkillSection from '../components/core/HomePage/SkillSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/core/HomePage/Footer';

const Home = () => {
  return (
    <div className='bg-richblack-900'>
        {/* Section 01 */}
        <div className='flex fles-col bg-richblack-900'>

          <div className='w-11/12 max-w-[1260px] mx-auto mt-10 flex flex-col items-center bg-richblack-900 px-4 pb-8'>
            {/* Become an instructor button */}
            <Link to={"/signup?accountType=instructor"}>
              <div className='flex flex-row items-center gap-2 border-gray-950 border-1 rounded-4xl px-8 py-3 text-md 
                              font-inter bg-richblack-800 hover:bg-richblack-700 hover:cursor-pointer hover:scale-93 
                              shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]
                              transition-all duration-300 text-richblack-50'>
                <p>Become an Instructor</p>
                <FaArrowCircleRight />
              </div>
            </Link>

            {/* Headin, subheading, button */}
            <div className='lg:mt-4 mt-2 flex flex-col gap-4 items-center text-center'>
              <p className='lg:text-4xl text-2xl text-white font-bold font-inter'>
                Empower your future with <ColourText text={"Coding Skills"} />
              </p>
              <p className='text-richblack-200 text-center font-inter '>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a 
                wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
              </p>

              <div className='flex flex-row gap-6'>
                <CTAButton active={true} path={"/signup"}>Learn More</CTAButton>
                <CTAButton active={false} path={"/login"}>Book a demo</CTAButton>
              </div> 
            </div>

            {/* Video */}
            <div className='lg:mt-16 mt-8 
                            shadow-[15px_15px_0px_0px_rgba(255,255,255,0.8),-15px_-15px_80px_-20px_rgba(135,206,235,0.8)]'>
              <video 
              className=''
              muted
              loop
              autoPlay
              >
                <source src={Banner} type='video/mp4' />

              </video>
            </div>

            {/* Code section */}
            <div className='lg:mb-16 mb-8 flex flex-col lg:gap-16 '>
              <Codeblock
              
              position={"lg:flex-row"}
              heading={
                <div> 
                  Unlock your <ColourText text={"coding potential"}/> with our online courses.
                </div>
              }
              subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

              ctabtn1={{
                active:true,
                path:"/signup",
                children:"Get Started"
              }}

              ctabtn2={{
                active:false,
                path:"/login",
                children:"Learn More"
              }}

              codecolor={"text-green-400"}
              codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>\n</html>`}
              gradientcolor={"bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]"}
              />

              {/* Code section 02 */}
              <Codeblock
              
              position={"lg:flex-row-reverse"}
              heading={
                <div> 
                  Start <ColourText text={"coding in seconds"}/>
                </div>
              }
              subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

              ctabtn1={{
                active:true,
                path:"/signup",
                children:"Continue Lesson"
              }}

              ctabtn2={{
                active:false,
                path:"/login",
                children:"Learn More"
              }}

              codecolor={"text-green-400"}
              codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>\n</html>`}
              gradientcolor={"bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]"}
              
              />
            </div>

            {/* Explore more */}
            <ExploreMore />
             

          </div>

        </div>

        {/* Section 02 */}
        <div className='bg-richblack-5 text-richblack-700 pb-8'>
          <div className='bg_homepage lg:h-80 h-32'>
            <div className='w-11/12 max-w-[1260px] h-[100%] mx-auto flex flex-row justify-center gap-6 items-center lg:pt-36'>
                <div className=''>
                  <CTAButton active={true} path={"/signup"} className={"flex flex-row items-center justify-center lg:gap-2 gap-0.5"}>
                    Explore Full Catalog
                    <FaArrowCircleRight />
                  </CTAButton>
                </div>
                <CTAButton active={false} path={"/login"}>Learn More</CTAButton>
            </div>
          </div>
          {/* Job that is in demand section */}
          <div className='w-11/12 max-w-[1260px] mx-auto'>
            <div className='flex lg:flex-row flex-col 
                          lg:justify-between lg:mt-16 mt-8 lg:gap-56 gap-8 pb-16'>
              {/* left */}
              <div >
                <p className='lg:text-4xl text-2xl font-bold font-inter'>
                  Get the skills you need for a <ColourText text={"job that is in demand"}/>
                </p>
              </div>

              {/* right */}
              <div className='flex flex-col gap-8 lg:items-start items-center'>
                <p className='lg:text-base text-sm font-inter'>
                  The modern StudyNotion is the dictates its own terms. Today, to be a competitive 
                  specialist requires more than professional skills.
                </p>
                <CTAButton active={true} path={"/signup"} >Learn More</CTAButton>
              </div>
          </div>
          {/* SkillSection */}
          <SkillSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
          </div>
        </div>

        {/* Section 03 */}
        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
          {/* Become a instructor section */}
          <InstructorSection />

          {/* Reviws from Other Learner */}
          <h1 className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners
          </h1>
          {/* <ReviewSlider /> */}
        </div>

        {/* Footer */}
        <Footer />

        {/* Section 04 */}
    </div>
  )
}

export default Home