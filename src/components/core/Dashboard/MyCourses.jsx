import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconButton"
import CoursesTable from "./InstructorCourses/CoursesTable"
import { resetCourseState } from "../../../slices/courseSlice"

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
                  My Courses
                </h1>
                <p className="text-richblack-300">
                  Manage and track your course library
                </p>
              </div>
              <button
                onClick={() =>{
                  dispatch(resetCourseState())
                  navigate("/dashboard/add-course")
                }}
                className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold flex items-center 
                          cursor-pointer gap-2 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <VscAdd className="text-xl" />
                <span>Add New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700 shadow-lg">
            <p className="text-blue-200 text-sm mb-1">Total Courses</p>
            <p className="text-white text-3xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700 shadow-lg">
            <p className="text-purple-200 text-sm mb-1">Published</p>
            <p className="text-white text-3xl font-bold">
              {courses.filter(c => c.status === "Published").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-900 to-pink-800 p-6 rounded-xl border border-pink-700 shadow-lg">
            <p className="text-pink-200 text-sm mb-1">Drafts</p>
            <p className="text-white text-3xl font-bold">
              {courses.filter(c => c.status === "Draft").length}
            </p>
          </div>
        </div>

        {/* Courses Table */}
        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
    </div>
  )
}