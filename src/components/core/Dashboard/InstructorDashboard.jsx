import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaBook, FaUsers, FaChartLine, FaDollarSign, FaClock, FaEye, FaStar, FaArrowUp, FaArrowDown, FaRupeeSign } from 'react-icons/fa'
import { VscAdd } from 'react-icons/vsc'
import { getInstructorData } from '../../../services/operations/userAPI'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData()
      const result = await fetchInstructorCourses()
      
      if (instructorApiData) {
        setInstructorData(instructorApiData)
      }
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalStudents = instructorData?.totalStudents || 0
  const totalIncome = instructorData?.totalIncome || 0
  const totalCourses = courses?.length || 0
  const hasCourses = courses && courses.length > 0

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading dashboard...</p>
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
        {/* Welcome Card */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-6">
              <div>
                <h1 className="lg:text-3xl text-2xl font-bold text-richblack-5 mb-2">
                  Hi {user?.firstName} 👋
                </h1>
                <p className="text-richblack-300">
                  {hasCourses ? "Let's start something new" : "Ready to create your first course?"}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/add-course")}
                className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold flex items-center 
                          cursor-pointer gap-2 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <VscAdd className="text-xl" />
                <span>New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-800 rounded-lg">
                <FaBook className="text-blue-200 text-xl" />
              </div>
              {hasCourses && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <FaArrowUp className="text-xs" />
                  <span>12%</span>
                </div>
              )}
            </div>
            <p className="text-blue-200 text-sm mb-1">Total Courses</p>
            <p className="text-white text-3xl font-bold">{totalCourses}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-800 rounded-lg">
                <FaUsers className="text-purple-200 text-xl" />
              </div>
              {totalStudents > 0 && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <FaArrowUp className="text-xs" />
                  <span>8%</span>
                </div>
              )}
            </div>
            <p className="text-purple-200 text-sm mb-1">Total Students</p>
            <p className="text-white text-3xl font-bold">{totalStudents}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900 to-pink-800 p-6 rounded-xl border border-pink-700 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-pink-800 rounded-lg">
                <FaRupeeSign className="text-pink-200 text-xl" />
              </div>
              {totalIncome > 0 && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <FaArrowUp className="text-xs" />
                  <span>15%</span>
                </div>
              )}
            </div>
            <p className="text-pink-200 text-sm mb-1">Total Income</p>
            <p className="text-white text-3xl font-bold">₹{totalIncome?.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts Section - Only show if courses exist */}
        {hasCourses && (
          <div className="mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="lg:px-10 lg:py-8 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-richblack-5 mb-1">Visualize</h2>
                  <p className="text-richblack-300 text-sm">Track your performance</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg font-medium text-sm hover:bg-yellow-100 transition-all duration-200">
                    Students
                  </button>
                  <button className="px-4 py-2 bg-richblack-700 text-richblack-300 rounded-lg font-medium text-sm hover:bg-richblack-600 transition-all duration-200">
                    Income
                  </button>
                </div>
              </div>
              
              <div className="bg-richblack-700 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <FaChartLine className="text-richblack-400 text-5xl mx-auto mb-4" />
                  <p className="text-richblack-300">Chart will be displayed here</p>
                  <p className="text-richblack-400 text-sm mt-2">Integrate with Chart.js or Recharts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Courses Section */}
        <div className="mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-richblack-5">Your Courses</h2>
              {hasCourses && (
                <button
                  onClick={() => navigate("/dashboard/my-courses")}
                  className="text-yellow-50 hover:text-yellow-100 text-sm font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <FaArrowUp className="rotate-45" />
                </button>
              )}
            </div>

            {hasCourses ? (
              <div className="space-y-4">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course._id}
                    className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-richblack-5 font-semibold mb-1">
                          {course.courseName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-richblack-400">
                          <span className="flex items-center gap-1">
                            <FaUsers />
                            {course.studentsEnrolled?.length || 0} students
                          </span>
                          <span className="flex items-center gap-1">
                            <FaDollarSign />
                            ₹{course.price}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "Draft"
                              ? "bg-yellow-900 text-yellow-100"
                              : "bg-green-900 text-green-100"
                          }`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-6 bg-richblack-700 rounded-full mb-4">
                  <FaBook className="text-richblack-400 text-5xl" />
                </div>
                <h3 className="text-richblack-5 text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-richblack-300 mb-6 max-w-md mx-auto">
                  Start your teaching journey by creating your first course. Share your knowledge with students around the world.
                </p>
                <button
                  onClick={() => navigate("/dashboard/add-course")}
                  className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
                >
                  <VscAdd className="text-xl" />
                  Create Your First Course
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/dashboard/my-courses")}
            className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 hover:bg-richblack-700 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-richblack-700 group-hover:bg-richblack-600 rounded-lg transition-colors">
                <FaBook className="text-yellow-50 text-2xl" />
              </div>
              <div>
                <h3 className="text-richblack-5 font-semibold mb-1">
                  {hasCourses ? "Manage Courses" : "My Courses"}
                </h3>
                <p className="text-richblack-400 text-sm">
                  {hasCourses ? "Edit and update your courses" : "View all your courses"}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/settings")}
            className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 hover:bg-richblack-700 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-richblack-700 group-hover:bg-richblack-600 rounded-lg transition-colors">
                <FaUsers className="text-yellow-50 text-2xl" />
              </div>
              <div>
                <h3 className="text-richblack-5 font-semibold mb-1">Profile Settings</h3>
                <p className="text-richblack-400 text-sm">Update your profile information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard