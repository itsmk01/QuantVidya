import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaLightbulb, FaChevronRight } from "react-icons/fa"
import RenderSteps from "./RenderSteps"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { resetCourseState } from "../../../../slices/courseSlice"
import ColourText from "../../HomePage/ColourText"

export default function AddCourse() {
  const { resetId } = useSelector((state) => state.course);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetCourseState());
  },[dispatch]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto pt-6 lg:pt-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span>Dashboard</span>
            <FaChevronRight className="text-xs" />
            <span>My Courses</span>
            <FaChevronRight className="text-xs" />
            <span className="text-richblack-50">Add Course</span>
          </div>

          {/* Title Section with Back Button */}
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="p-2 hover:bg-richblack-800 rounded-lg transition-all duration-200 group flex-shrink-0"
              title="Back to My Courses"
            >
              <FaArrowLeft className="text-richblack-300 group-hover:text-richblack-5 text-lg" />
            </button>
            <div className="h-8 w-[1px] bg-richblack-700"></div>
            <div className="flex-1">
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                Create New <ColourText text="Course" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                Share your knowledge with students around the world
              </p>
            </div>
          </div>
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
                <RenderSteps key={resetId} />
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
                    Course Upload <ColourText text="Tips" />
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-richblack-300 font-inter">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Set the Course Price option or make it free.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Standard size for the course thumbnail is 1024x576.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Video section controls the course overview video.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>Course Builder is where you create & organize a course.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Add Topics in the Course Builder section to create lessons,
                      quizzes, and assignments.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Information from the Additional Data section shows up on the
                      course single page.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-50 mt-0.5 flex-shrink-0">•</span>
                    <span>
                      Make Announcements to notify any important notes to all enrolled 
                      students at once.
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