import React from 'react'

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({course, currentCard, setCurrentCard}) => {
  return (
    <div 
        onClick={() => setCurrentCard(course?.heading)}
        className={`lg:h-80 h-72 lg:w-[calc((100%-32px)/3)] flex flex-col gap-4 p-6  rounded-md relative z-0 cursor-pointer
                    ${currentCard === course?.heading ? 
                        "bg-richblack-5 shadow-[15px_15px_0px_0px_rgba(255,214,10,0.8),_-15px_-15px_60px_-25px_rgba(255,214,10,0.6)]"
                        : "bg-richblack-800"}`}>
        <div className={`text-xl font-semibold 
            ${currentCard === course?.heading ? "text-black" : "text-white"} hover:text-yellow-25 hover:cursor-pointer`}>
            {course?.heading}
        </div>
        <div className={`${currentCard === course?.heading ? "text-richblack-600 font-medium" 
                        : "text-richblack-200 font-normal"} font-inter`}>
            {course?.description}
        </div>
        <div className='border-b-2 border-dashed border-richblack-100 absolute z-10 left-0 right-0 bottom-14'></div>
        <div className={`flex flex-row justify-between absolute z-10 left-6 right-6 bottom-4
            ${currentCard === course?.heading ? "text-blue-200" : "text-richblack-200"} `}>
            <div className='flex flex-row gap-2 items-center'>
                <HiUsers/>
                <div>{course?.level}</div>
            </div>
            <div className='flex flex-row gap-2 items-center'>
                <ImTree/>
                <div>{course?.lessionNumber}</div>
            </div>
        </div>
    </div>
  )
}

export default CourseCard