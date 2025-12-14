import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaPlayCircle, FaClock, FaFileAlt } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'

const CourseContentSection = ({ courseContent }) => {
  const [activeSection, setActiveSection] = useState(null)

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index)
  }

  const getTotalDuration = () => {
    let total = 0
    courseContent?.forEach(section => {
      section.subSection?.forEach(sub => {
        total += parseInt(sub.timeDuration) || 0
      })
    })
    return Math.floor(total / 60) // Convert to minutes
  }

  const getTotalLectures = () => {
    let total = 0
    courseContent?.forEach(section => {
      total += section.subSection?.length || 0
    })
    return total
  }

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
      <div className="p-6 lg:p-8 border-b border-richblack-700">
        <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-3">
          Course <ColourText text="Content" />
        </h2>
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-richblack-300">
          <div className="flex items-center gap-2">
            <FaFileAlt className="text-sm" />
            <span className="text-sm font-inter">
              {courseContent?.length || 0} sections
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaPlayCircle className="text-sm" />
            <span className="text-sm font-inter">
              {getTotalLectures()} lectures
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-sm" />
            <span className="text-sm font-inter">
              {getTotalDuration()} min total
            </span>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="divide-y divide-richblack-700">
        {courseContent?.map((section, index) => (
          <div key={section._id || index}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 lg:px-8 py-5 flex items-center justify-between 
                         hover:bg-richblack-700 transition-colors duration-200 text-left"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white font-inter mb-1">
                  {section.sectionName}
                </h3>
                <p className="text-sm text-richblack-300 font-inter">
                  {section.subSection?.length || 0} lectures
                </p>
              </div>
              
              {activeSection === index ? (
                <FaChevronUp className="text-richblack-300 text-lg flex-shrink-0 ml-4" />
              ) : (
                <FaChevronDown className="text-richblack-300 text-lg flex-shrink-0 ml-4" />
              )}
            </button>

            {/* Subsections */}
            {activeSection === index && (
              <div className="bg-richblack-900 px-6 lg:px-8 py-4">
                <div className="space-y-3">
                  {section.subSection?.map((subSection, subIndex) => (
                    <div 
                      key={subSection._id || subIndex}
                      className="flex items-start gap-3 p-4 bg-richblack-800 rounded-lg 
                                 hover:bg-richblack-700 transition-colors duration-200 cursor-pointer
                                 border border-richblack-700"
                    >
                      <FaPlayCircle className="text-yellow-50 text-lg mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-white font-inter font-medium mb-1">
                          {subSection.title}
                        </h4>
                        {subSection.description && (
                          <p className="text-sm text-richblack-300 font-inter mb-2">
                            {subSection.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-richblack-400 text-sm">
                          <FaClock className="text-xs" />
                          <span className="font-inter">
                            {Math.floor((subSection.timeDuration || 0) / 60)} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseContentSection