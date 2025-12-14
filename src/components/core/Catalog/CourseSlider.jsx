import React, { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CourseCard from './CourseCard'

const CourseSlider = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [coursesPerView, setCoursesPerView] = useState(3)

  const publishedCourses = courses.filter(course => course.status === 'Published');

  // Handle responsive courses per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCoursesPerView(1) // Mobile: 1 course
      } else if (window.innerWidth < 1024) {
        setCoursesPerView(2) // Tablet: 2 courses
      } else {
        setCoursesPerView(3) // Desktop: 3 courses
      }
    }
    // Set initial value
    handleResize()
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset index when coursesPerView changes to avoid out of bounds
  useEffect(() => {
    const newMaxIndex = Math.max(0, publishedCourses.length - coursesPerView)
    if (currentIndex > newMaxIndex) {
      setCurrentIndex(newMaxIndex)
    }
  }, [coursesPerView, publishedCourses.length, currentIndex])

  const maxIndex = Math.max(0, publishedCourses.length - coursesPerView)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  if (!publishedCourses || publishedCourses.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {publishedCourses.length > coursesPerView && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 
                        w-8 h-8 sm:w-10 sm:h-10 
                        bg-yellow-50 text-richblack-900 rounded-full 
                        flex items-center justify-center shadow-lg 
                        transition-all duration-200 ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-yellow-100 hover:scale-110'
            }`}
            aria-label="Previous courses"
          >
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 
                        w-8 h-8 sm:w-10 sm:h-10 
                        bg-yellow-50 text-richblack-900 rounded-full 
                        flex items-center justify-center shadow-lg 
                        transition-all duration-200 ${
              currentIndex >= maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-yellow-100 hover:scale-110'
            }`}
            aria-label="Next courses"
          >
            <FaChevronRight className="text-sm sm:text-base" />
          </button>
        </>
      )}

      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / coursesPerView)}%)`,
          }}
        >
          {publishedCourses.map((course) => (
            <div
              key={course._id}
              className="flex-shrink-0"
              style={{ 
                width: coursesPerView === 1 
                  ? '100%' 
                  : `calc(${100 / coursesPerView}% - ${(coursesPerView - 1) * (coursesPerView === 2 ? 16 : 24) / coursesPerView}px)` 
              }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {publishedCourses.length > coursesPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-yellow-50 w-6 sm:w-8'
                  : 'w-2 bg-richblack-600 hover:bg-richblack-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseSlider