import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaBook, FaCheck, FaEdit, FaChevronRight } from "react-icons/fa"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./InstructorCourses/CoursesTable"
import { resetCourseState } from "../../../slices/courseSlice"
import ColourText from "../HomePage/ColourText"

export default function MyCourses() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses()
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading My Courses...</p>
        </div>
      </div>
    )
  }

  const publishedCount = courses.filter(c => c.status === "Published").length
  const draftCount = courses.filter(c => c.status === "Draft").length

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
            <span className="text-richblack-50">My Courses</span>
          </div>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-5">
            <div>
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                My <ColourText text="Courses" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                Manage and track your course library
              </p>
            </div>
            <button
              onClick={() => {
                dispatch(resetCourseState())
                navigate("/dashboard/add-course")
              }}
              className="bg-yellow-50 text-richblack-900 px-5 py-2.5 rounded-lg font-semibold 
                       flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 
                       hover:scale-105 shadow-md text-sm self-start md:self-center"
            >
              <VscAdd className="text-lg" />
              <span>New Course</span>
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
                  <p className="text-richblack-300 text-xs">Total Courses</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{courses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaCheck className="text-caribbeangreen-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Published</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{publishedCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaEdit className="text-blue-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Drafts</p>
                  <p className="text-white text-lg lg:text-xl font-bold">{draftCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        {/* Courses Table Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
              Course <ColourText text="Library" />
            </h2>
            <p className="text-richblack-300 font-inter text-sm">
              View and manage all your courses
            </p>
          </div>

          {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
        </div>
      </div>
    </div>
  )
}