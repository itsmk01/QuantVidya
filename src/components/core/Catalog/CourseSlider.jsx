import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CourseCard from './CourseCard'

const CourseSlider = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const coursesPerView = 2 // Show 2 courses at a time
  const maxIndex = Math.max(0, courses.length - coursesPerView)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {courses.length > coursesPerView && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-yellow-50 text-richblack-900 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-yellow-100 hover:scale-110'
            }`}
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-yellow-50 text-richblack-900 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              currentIndex >= maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-yellow-100 hover:scale-110'
            }`}
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / coursesPerView)}%)`,
          }}
        >
          {courses.map((course) => (
            <div
              key={course._id}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / coursesPerView}% - ${(coursesPerView - 1) * 24 / coursesPerView}px)` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {courses.length > coursesPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-yellow-50 w-6'
                  : 'bg-richblack-600 hover:bg-richblack-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseSlider