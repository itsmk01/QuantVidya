import React from 'react'
import { useState } from 'react';
import { HomePageExplore} from '../../../data/homepage-explore';
import ColourText from './ColourText';
import CourseCard from './CourseCard';

const ExploreMore = () => {

  const Tabs= ["Free", "New to coding", "Most popular","Skills paths", "Career paths"];

  const [currentTab, setCurrentTab] = useState(Tabs[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };


  return (
    <div className='w-11/12 max-w-[1260px] mx-auto lg:pb-56 relative'>
        <div className='flex flex-col items-center text-center gap-8 pt-10'>
          <div className='flex flex-col gap-2'>
            <p className='lg:text-4xl text-2xl text-white font-bold font-inter'>
              Unlock the <ColourText text={"Power of Code"}/>
            </p>
            <p className='text-richblack-200 text-center font-inter'>Learn to Build Anything You Can Imagine</p>
          </div>
          
          <div className='lg:w-[75%] w-[90%] flex lg:flex-row md:flex-row flex-col justify-between items-center lg:gap-6 
                          font-medium font-inter shadow-[0_2px_8px_rgba(255,255,255,0.6)]  
                          lg:rounded-full rounded-4xl p-1 bg-richblack-800'>
            {Tabs.map((tab, i) => {
              return (
                <div 
                key={i}  
                onClick={() => setMyCards(tab)}
                className={`px-8 py-2 rounded-full transition-all duration-300 cursor-pointer
                          ${currentTab === tab ? "text-white border border-richblack-400 bg-richblack-900 "
                          : "text-richblack-200 hover:bg-richblack-900 "} `}
                >
                  {tab}
                </div>
              )
            })}
          </div>
        </div>

        <div className='left-0 right-0 flex lg:flex-row flex-col items-center justify-center lg:gap-16 gap-6 mt-16 lg:absolute'>
          {courses.map((course, i) => {
            return (
              <CourseCard 
              key={i} 
              course={course} 
              currentCard={currentCard} 
              setCurrentCard={setCurrentCard}
              className=""/>
            );
          })}
        </div>
    </div>
  )
}

export default ExploreMore