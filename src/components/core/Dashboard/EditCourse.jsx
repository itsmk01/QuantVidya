import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaBook, FaLightbulb, FaChevronRight } from "react-icons/fa"

import {
  getFullDetailsOfCourse,
} from "../../../services/operations/courseDetailsAPI"
import { resetCourseState, setCourse, setEditCourse } from "../../../slices/courseSlice"
import RenderSteps from "./AddCourse/RenderSteps"
import ColourText from "../../core/HomePage/ColourText"

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
            <span>My Courses</span>
            <FaChevronRight className="text-xs" />
            <span className="text-richblack-50">Edit Course</span>
          </div>

          {/* Title Section with Back Button */}
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={() => {
                navigate("/dashboard/my-courses");
                dispatch(resetCourseState());
              }}
              className="p-2 hover:bg-richblack-800 rounded-lg transition-all duration-200 group flex-shrink-0"
              title="Back to My Courses"
            >
              <FaArrowLeft className="text-richblack-300 group-hover:text-richblack-5 text-lg" />
            </button>
            <div className="h-8 w-[1px] bg-richblack-700"></div>
            <div className="flex-1">
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                Edit <ColourText text="Course" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                Update your course information and content
              </p>
            </div>
          </div>

          {/* Course Info Badge */}
          {course && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaBook className="text-yellow-50" />
                </div>
                <div>
                  <p className="text-richblack-400 text-xs mb-1 font-inter">Currently Editing</p>
                  <p className="text-richblack-5 font-semibold font-inter">{course.courseName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Side - Course Form */}
          <div className="flex-1 w-full">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl 
                          shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <div className="lg:px-10 lg:py-8 p-6">
                {course ? (
                  <RenderSteps />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-richblack-700 rounded-full flex items-center justify-center">
                      <FaBook className="text-richblack-400 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-richblack-5 mb-2 font-inter">
                      Course Not Found
                    </h3>
                    <p className="text-richblack-300 mb-6 font-inter">
                      The course you're looking for doesn't exist
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/my-courses")}
                      className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      Back to My Courses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Tips Card */}
          <div className="lg:sticky lg:top-6 w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl 
                          shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-richblack-700 rounded-lg">
                    <FaLightbulb className="text-yellow-50 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-richblack-5 font-inter">
                    Course Update <ColourText text="Tips" />
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-richblack-300 font-inter">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Review all course sections before publishing updates.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Update course thumbnail if content has significantly changed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Notify enrolled students about major course updates.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Test all video links and resources after updating.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Keep course description accurate and up-to-date with current content.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Make sure pricing reflects the updated course value.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Preview your changes before saving to ensure everything looks correct.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}