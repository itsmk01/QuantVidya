import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaBook, FaExclamationTriangle } from "react-icons/fa"

import {
  getFullDetailsOfCourse,
} from "../../../services/operations/courseDetailsAPI"
import { resetCourseState, setCourse, setEditCourse } from "../../../slices/courseSlice"
import RenderSteps from "./AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId)
      if (result) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result))
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading course details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 pb-12">
      {/* Hero Section with Gradient */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="w-11/12 max-w-[1000px] mx-auto -mt-16 relative z-10">
        {/* Header Card */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6">
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                    navigate("/dashboard/my-courses");
                    dispatch(resetCourseState());
                }}
                className="p-2 hover:bg-richblack-700 rounded-lg transition-all duration-200 group"
                title="Back to My Courses"
              >
                <FaArrowLeft className="text-richblack-300 group-hover:text-richblack-5 text-xl" />
              </button>
              <div className="h-8 w-[1px] bg-richblack-700"></div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-richblack-5 mb-1">
                  Edit Course
                </h1>
                <p className="text-richblack-300 text-sm">
                  Update your course information and content
                </p>
              </div>
            </div>

            {/* Course Info Badge */}
            {course && (
              <div className="flex items-center gap-3 p-4 bg-richblack-700 rounded-lg border border-richblack-600">
                <div className="p-2 bg-blue-900 rounded-lg">
                  <FaBook className="text-blue-200 text-lg" />
                </div>
                <div>
                  <p className="text-richblack-400 text-xs mb-1">Currently Editing</p>
                  <p className="text-richblack-5 font-semibold">{course.courseName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
          <div className="lg:px-10 lg:py-8 p-6">
            {course ? (
              <RenderSteps />
            ) : (
              <p className="text-center text-richblack-100 py-8">
                Course not found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}