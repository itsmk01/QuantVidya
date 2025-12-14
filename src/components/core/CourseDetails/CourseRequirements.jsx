import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'

const CourseRequirements = ({ requirements }) => {
  if (!requirements || requirements.length === 0) return null

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-6">
          <ColourText text="Requirements" />
        </h2>

        <ul className="space-y-3">
          {requirements.map((requirement, index) => (
            <li 
              key={index} 
              className="flex items-start gap-3 text-richblack-200 font-inter"
            >
              <FaCheckCircle className="text-caribbeangreen-300 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CourseRequirements