import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaUsers } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'
import CourseCard from '../Catalog/CourseCard'

const RelatedCourses = ({ courses, categoryName }) => {
  const navigate = useNavigate()

  if (!courses || courses.length === 0) return null
  

  return (
    <div className="bg-richblack-900 py-16">
      <div className="w-11/12 max-w-[1260px] mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-white font-inter mb-3">
          More Courses in <ColourText text={categoryName || 'This Category'} />
        </h2>
        <p className="text-richblack-200 font-inter text-base lg:text-lg mb-10">
          Expand your skills with related courses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedCourses