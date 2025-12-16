import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FaChevronLeft, FaChevronDown, FaChevronUp, FaStar, FaTimes } from "react-icons/fa"
import { BsCheckCircleFill } from "react-icons/bs"
import { MdOndemandVideo } from "react-icons/md"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeSection, setActiveSection] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveSection(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r border-richblack-700 bg-richblack-800">
      {/* Header */}
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
            title="Back"
          >
            <FaChevronLeft className="text-richblack-5" />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 transition-all duration-200 text-sm font-semibold"
            onClick={() => setReviewModal(true)}
          >
            <FaStar />
            Add Review
          </button>
        </div>
        <div className="flex flex-col">
          <p className="text-richblack-5 font-inter">{courseEntireData?.courseName}</p>
          <p className="text-sm font-semibold text-richblack-300 font-inter">
            {completedLectures?.length} / {totalNoOfLectures} lectures completed
          </p>
        </div>
      </div>

      {/* Sections and Lectures */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {courseSectionData.map((section, index) => (
          <div
            className="mt-2 cursor-pointer text-sm text-richblack-5"
            onClick={() => setActiveSection(section?._id)}
            key={index}
          >
            {/* Section */}
            <div className="flex flex-row justify-between bg-richblack-700 px-5 py-4 hover:bg-richblack-600 transition-all duration-200">
              <div className="w-[70%] font-semibold font-inter">
                {section?.sectionName}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-richblack-300 font-inter">
                  {section?.subSection.length} lecture{section?.subSection.length !== 1 ? 's' : ''}
                </span>
                <span className="text-richblack-300">
                  {activeSection === section?._id ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </span>
              </div>
            </div>

            {/* Sub Sections */}
            {activeSection === section?._id && (
              <div className="transition-[height] duration-500 ease-in-out">
                {section.subSection.map((lecture, i) => (
                  <div
                    className={`flex gap-3 px-5 py-3 hover:bg-richblack-700 transition-all duration-200 ${
                      videoBarActive === lecture._id
                        ? "bg-yellow-900 text-yellow-50 border-l-4 border-yellow-50"
                        : "bg-richblack-800 text-richblack-100"
                    }`}
                    key={i}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${lecture?._id}`
                      )
                      setVideoBarActive(lecture._id)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {completedLectures.includes(lecture?._id) ? (
                        <BsCheckCircleFill className="text-caribbeangreen-300 text-sm" />
                      ) : (
                        <MdOndemandVideo className="text-richblack-300 text-sm" />
                      )}
                    </div>
                    <span className="text-sm font-inter">{lecture.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}