import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBook, FaClock, FaCheckCircle, FaPlayCircle, FaChartLine, FaChevronRight } from 'react-icons/fa'
import { getUserEnrolledCourses } from '../../../services/operations/userAPI'
import ColourText from '../HomePage/ColourText'

const EnrolledCourses = () => {
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getEnrolledCourses = async () => {
      setLoading(true)
      try {
        const response = await getUserEnrolledCourses()
        setEnrolledCourses(response)
      } catch (error) {
        console.log("Could not fetch enrolled courses")
      }
      setLoading(false)
    }
    getEnrolledCourses()
  }, [])

  const completedCourses = enrolledCourses?.filter(
    course => course.progressPercentage === 100
  ).length || 0

  const inProgressCourses = enrolledCourses?.filter(
    course => course.progressPercentage > 0 && course.progressPercentage < 100
  ).length || 0

  const notStartedCourses = enrolledCourses?.filter(
    course => !course.progressPercentage || course.progressPercentage === 0
  ).length || 0

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto py-6 lg:py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span>Dashboard</span>
            <FaChevronRight className="text-xs" />
            <span className="text-richblack-50">Enrolled Courses</span>
          </div>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-5">
            <div>
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                Enrolled <ColourText text="Courses" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                Continue your learning journey
              </p>
            </div>
            <button
              onClick={() => navigate("/catalog")}
              className="bg-yellow-50 text-richblack-900 px-5 py-2.5 rounded-lg font-semibold 
                       flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 
                       hover:scale-105 shadow-md text-sm self-start md:self-center"
            >
              <FaBook className="text-sm" />
              <span>Browse Courses</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaBook className="text-yellow-50 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Total Enrolled</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{enrolledCourses?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaPlayCircle className="text-caribbeangreen-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">In Progress</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{inProgressCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaCheckCircle className="text-blue-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Completed</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{completedCourses}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        {/* Courses List */}
        {enrolledCourses && enrolledCourses.length > 0 ? (
          <>
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                  Your <ColourText text="Learning" />
                </h2>
                <p className="text-richblack-300 font-inter text-sm">
                  Continue where you left off
                </p>
              </div>

              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden 
                             shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                             transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                  >
                    <div className="lg:px-8 lg:py-6 p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-full lg:w-64 h-40 rounded-lg overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-yellow-50 rounded-full p-4">
                              <FaPlayCircle className="text-richblack-900 text-2xl" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl lg:text-2xl font-bold text-richblack-5 mb-2 group-hover:text-yellow-50 transition-colors font-inter">
                              {course.courseName}
                            </h3>
                            <p className="text-richblack-300 mb-3 line-clamp-2 text-sm font-inter">
                              {course.courseDescription}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-richblack-400 mb-4">
                              <span className="flex items-center gap-1.5">
                                <FaClock className="text-xs" />
                                {course.totalDuration || 'Duration not available'}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <FaChartLine className="text-xs" />
                                {course.progressPercentage || 0}% completed
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-richblack-300 font-inter">Progress</span>
                              <span className="text-xs font-semibold text-yellow-50">
                                {course.progressPercentage || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-yellow-50 h-full rounded-full transition-all duration-500"
                                style={{ width: `${course.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Statistics */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                  Learning <ColourText text="Statistics" />
                </h2>
                <p className="text-richblack-300 font-inter text-sm">
                  Track your progress
                </p>
              </div>

              <div className='bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-richblack-800 rounded-lg">
                        <FaPlayCircle className="text-yellow-50" />
                      </div>
                      <p className="text-sm text-richblack-300 font-inter">In Progress</p>
                    </div>
                    <p className="text-2xl font-bold text-richblack-5">{inProgressCourses}</p>
                  </div>

                  <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-richblack-800 rounded-lg">
                        <FaCheckCircle className="text-yellow-50" />
                      </div>
                      <p className="text-sm text-richblack-300 font-inter">Completed</p>
                    </div>
                    <p className="text-2xl font-bold text-richblack-5">{completedCourses}</p>
                  </div>

                  <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-richblack-800 rounded-lg">
                        <FaClock className="text-yellow-50" />
                      </div>
                      <p className="text-sm text-richblack-300 font-inter">Not Started</p>
                    </div>
                    <p className="text-2xl font-bold text-richblack-5">{notStartedCourses}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='bg-richblack-800 border border-richblack-700 rounded-xl 
                        shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
            <div className="lg:px-10 lg:py-8 p-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-richblack-700 rounded-full flex items-center justify-center">
                  <FaBook className="text-richblack-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-richblack-5 mb-2 font-inter">
                  No Courses Enrolled Yet
                </h3>
                <p className="text-richblack-300 mb-6 font-inter">
                  Start your learning journey by enrolling in courses
                </p>
                <button
                  onClick={() => navigate("/catalog")}
                  className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourses