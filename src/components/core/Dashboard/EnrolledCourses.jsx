import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBook, FaClock, FaCheckCircle, FaPlayCircle, FaChartLine } from 'react-icons/fa'
import { getUserEnrolledCourses } from '../../../services/operations/userAPI'

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
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 pb-12">
      {/* Hero Section with Gradient Cover */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="w-11/12 max-w-[1000px] mx-auto -mt-16 relative z-10">
        {/* Header Card */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-6">
              <div>
                <h1 className="lg:text-3xl text-2xl font-bold text-richblack-5 mb-2">
                  Enrolled Courses
                </h1>
                <p className="text-richblack-300">
                  Continue your learning journey
                </p>
              </div>
              <button
                onClick={() => navigate("/catalog")}
                className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold flex items-center 
                          cursor-pointer gap-2 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FaBook className="text-lg" />
                <span>Browse Courses</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-800 rounded-lg">
                <FaBook className="text-blue-200 text-xl" />
              </div>
            </div>
            <p className="text-blue-200 text-sm mb-1">Total Enrolled</p>
            <p className="text-white text-3xl font-bold">{enrolledCourses?.length || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-800 rounded-lg">
                <FaPlayCircle className="text-purple-200 text-xl" />
              </div>
            </div>
            <p className="text-purple-200 text-sm mb-1">In Progress</p>
            <p className="text-white text-3xl font-bold">{inProgressCourses}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900 to-pink-800 p-6 rounded-xl border border-pink-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-pink-800 rounded-lg">
                <FaCheckCircle className="text-pink-200 text-xl" />
              </div>
            </div>
            <p className="text-pink-200 text-sm mb-1">Completed</p>
            <p className="text-white text-3xl font-bold">{completedCourses}</p>
          </div>
        </div>

        {/* Courses List */}
        {enrolledCourses && enrolledCourses.length > 0 ? (
          <div className="mt-6 space-y-6">
            {enrolledCourses.map((course, index) => (
              <div
                key={course._id}
                className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
              >
                <div className="lg:px-10 lg:py-8 p-6">
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
                        <h3 className="text-2xl font-bold text-richblack-5 mb-2 group-hover:text-yellow-50 transition-colors">
                          {course.courseName}
                        </h3>
                        <p className="text-richblack-300 mb-3 line-clamp-2">
                          {course.courseDescription}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-richblack-400 mb-4">
                          <span className="flex items-center gap-2">
                            <FaClock />
                            {course.totalDuration || 'Duration not available'}
                          </span>
                          <span className="flex items-center gap-2">
                            <FaChartLine />
                            {course.progressPercentage || 0}% completed
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-richblack-300">Progress</span>
                          <span className="text-sm font-semibold text-yellow-50">
                            {course.progressPercentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-50 to-yellow-100 h-full rounded-full transition-all duration-500"
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
        ) : (
          <div className="mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
            <div className="lg:px-10 lg:py-8 p-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-richblack-700 rounded-full flex items-center justify-center">
                  <FaBook className="text-richblack-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-richblack-5 mb-2">
                  No Courses Enrolled Yet
                </h3>
                <p className="text-richblack-300 mb-6">
                  Start your learning journey by enrolling in courses
                </p>
                <button
                  onClick={() => navigate("/catalog")}
                  className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Learning Stats */}
        {enrolledCourses && enrolledCourses.length > 0 && (
          <div className="mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="lg:px-10 lg:py-8 p-6">
              <h2 className="text-xl font-semibold text-richblack-5 mb-6">Learning Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaPlayCircle className="text-yellow-50 text-lg" />
                    </div>
                    <p className="text-sm text-richblack-300">In Progress</p>
                  </div>
                  <p className="text-2xl font-bold text-richblack-5">{inProgressCourses}</p>
                </div>

                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaCheckCircle className="text-yellow-50 text-lg" />
                    </div>
                    <p className="text-sm text-richblack-300">Completed</p>
                  </div>
                  <p className="text-2xl font-bold text-richblack-5">{completedCourses}</p>
                </div>

                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaClock className="text-yellow-50 text-lg" />
                    </div>
                    <p className="text-sm text-richblack-300">Not Started</p>
                  </div>
                  <p className="text-2xl font-bold text-richblack-5">{notStartedCourses}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourses