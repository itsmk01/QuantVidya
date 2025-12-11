import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaLightbulb } from "react-icons/fa"
import RenderSteps from "./RenderSteps"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { resetCourseState } from "../../../../slices/courseSlice"

export default function AddCourse() {
  const { resetId } = useSelector((state) => state.course);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetCourseState());
  },[dispatch]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 pb-12">
      {/* Hero Section with Gradient */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="w-11/12 max-w-[1200px] mx-auto -mt-16 relative z-10">
        {/* Header Card */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6">
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard/my-courses")}
                className="p-2 hover:bg-richblack-700 rounded-lg transition-all duration-200 group"
                title="Back to My Courses"
              >
                <FaArrowLeft className="text-richblack-300 group-hover:text-richblack-5 text-xl" />
              </button>
              <div className="h-8 w-[1px] bg-richblack-700"></div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-richblack-5 mb-1">
                  Create New Course
                </h1>
                <p className="text-richblack-300 text-sm">
                  Share your knowledge with students around the world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Side - Course Form */}
          <div className="flex-1 w-full">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
              <div className="lg:px-10 lg:py-8 p-6">
                <RenderSteps key={resetId} />
              </div>
            </div>
          </div>

          {/* Right Side - Tips Card */}
          <div className="lg:sticky lg:top-6 w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-900 rounded-lg">
                    <FaLightbulb className="text-yellow-100 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-richblack-5">
                    Course Upload Tips
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-richblack-300">
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