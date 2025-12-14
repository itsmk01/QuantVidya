import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CourseDetailsHero from '../components/core/CourseDetails/CourseDetailsHero'
import CourseContentSection from '../components/core/CourseDetails/CourseContentSection'
import InstructorCard from '../components/core/CourseDetails/InstructorCard'
import CourseRequirements from '../components/core/CourseDetails/CourseRequirements'
import CourseBenefits from '../components/core/CourseDetails/CourseBenefits'
import ReviewsSection from '../components/core/CourseDetails/ReviewsSection'
import RelatedCourses from '../components/core/CourseDetails/RelatedCourses'
import PurchaseCard from '../components/core/CourseDetails/PurchaseCard'
import Footer from '../components/core/HomePage/Footer'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'

const CourseDetails = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true)
      try {
        const result = await getFullDetailsOfCourse(courseId)
        setCourseData(result)
        
        // Check if user is enrolled
        if (user && result?.studentsEnrolled) {
          setIsEnrolled(result.studentsEnrolled.includes(user._id))
        }
      } catch (error) {
        console.log("Could not fetch course details:", error)
      }
      setLoading(false)
    }
    
    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId, user])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse font-inter">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-inter">Course Not Found</h2>
          <p className="text-richblack-300 mb-6 font-inter">The course you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-yellow-50 text-richblack-900 rounded-lg font-semibold 
                       hover:scale-95 transition-all font-inter"
          >
            Browse Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section */}
      <CourseDetailsHero 
        courseData={courseData} 
        isEnrolled={isEnrolled}
      />

      {/* Main Content */}
      <div className="bg-richblack-900 py-12 lg:py-16">
        <div className="w-11/12 max-w-[1260px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              {courseData.whatYouWillLearn && (
                <CourseBenefits whatYouWillLearn={courseData.whatYouWillLearn} />
              )}

              {/* Course Content */}
              {courseData.courseContent && courseData.courseContent.length > 0 && (
                <CourseContentSection courseContent={courseData.courseContent} />
              )}
              
              {/* Requirements */}
              {courseData.instructions && courseData.instructions.length > 0 && (
                <CourseRequirements requirements={courseData.instructions} />
              )}
              
              {/* Instructor */}
              {courseData.instructor && (
                <InstructorCard instructor={courseData.instructor} />
              )}
              
              {/* Reviews */}
              <ReviewsSection reviews={courseData.ratingAndReviews || []} />
            </div>

            {/* Right Column - Purchase Card (Sticky) */}
            <div className="lg:col-span-1">
              <PurchaseCard courseData={courseData} isEnrolled={isEnrolled} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Courses Section */}
      {courseData.category?.courses && courseData.category.courses.length > 0 && (
        <RelatedCourses 
          courses={courseData.category.courses.filter(c => c._id !== courseData._id)} 
          categoryName={courseData.category.name}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CourseDetails