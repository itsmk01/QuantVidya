import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaUsers, FaClock, FaPlayCircle } from 'react-icons/fa'
import { BsCurrencyRupee } from 'react-icons/bs'

const CourseCard = ({ course }) => {
  const [imageHover, setImageHover] = useState(false)

  const avgReviewCount = course?.ratingAndReviews?.length || 0
  const avgRating = avgReviewCount > 0
    ? (course.ratingAndReviews.reduce((acc, review) => acc + review.rating, 0) / avgReviewCount).toFixed(1)
    : 0

  return (
    <Link to={`/courses/${course._id}`}>
      <div className="bg-richblack-700 rounded-xl overflow-hidden hover:bg-richblack-600 transition-all duration-300 group h-full flex flex-col">
        {/* Thumbnail */}
        <div 
          className="relative h-48 overflow-hidden"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
            imageHover ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-yellow-50 rounded-full p-4">
              <FaPlayCircle className="text-richblack-900 text-2xl" />
            </div>
          </div>
          
          {/* Status Badge */}
          {course.status && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-50 text-richblack-900 rounded-full text-xs font-semibold">
              {course.status}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category */}
          {course.category?.name && (
            <span className="text-xs text-yellow-50 font-semibold mb-2 inline-block">
              {course.category.name}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-richblack-5 mb-2 line-clamp-2 group-hover:text-yellow-50 transition-colors">
            {course.courseName}
          </h3>

          {/* Description */}
          <p className="text-richblack-300 text-sm mb-4 line-clamp-2 flex-1">
            {course.courseDescription}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={course.instructor?.additionalDetails?.image || '/default-avatar.png'}
              alt={course.instructor?.firstName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <p className="text-richblack-300 text-sm">
              {course.instructor?.firstName} {course.instructor?.lastName}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-xs text-richblack-400">
            <span className="flex items-center gap-1">
              <FaUsers />
              {course.studentsEnrolled?.length || 0} students
            </span>
            <span className="flex items-center gap-1">
              <FaClock />
              {course.totalDuration || '10h'}
            </span>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center justify-between pt-4 border-t border-richblack-600">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-50 text-sm" />
              <span className="text-richblack-5 font-semibold text-sm">
                {avgRating}
              </span>
              <span className="text-richblack-400 text-xs">
                ({avgReviewCount})
              </span>
            </div>
            <div className="flex items-center text-xl font-bold text-yellow-50">
              <BsCurrencyRupee />
              <span>{course.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard