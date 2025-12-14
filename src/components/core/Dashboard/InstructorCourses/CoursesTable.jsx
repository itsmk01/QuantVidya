import React from "react";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { formatDate } from "../../../../services/formatDate";
import {formatDuration} from "../../../../services/formatDuration";
import { HiClock } from "react-icons/hi";
import {  FaCheckCircle, FaTrash } from "react-icons/fa";
import { BsCurrencyRupee } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { resetCourseState } from "../../../../slices/courseSlice";

const CoursesTable = ({ courses, setCourses }) => {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false)
  	const [confirmationModal, setConfirmationModal] = useState(null)

	const handleCourseDelete = async (courseId) => {
		setLoading(true);
		const result = await deleteCourse({courseId});
		console.log("result after delete course", result);
		if (result) {
			setCourses((prevCourses) =>
			prevCourses.filter((course) => course._id !== courseId)
			);
			setConfirmationModal(null);
			dispatch(resetCourseState());
		}
		setLoading(false);
	};

  return (
    <div className="mt-6 space-y-6">
      {courses.map((course, index) => (
        <div 
          key={course._id}
          className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl 
                      transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          <div className="lg:px-10 lg:py-8 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Thumbnail */}
              <div className="relative flex-shrink-0 w-full lg:w-64 h-40 rounded-lg overflow-hidden group">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  course.status === "Draft" 
                    ? "bg-yellow-900 text-yellow-100 border border-yellow-700" 
                    : "bg-green-900 text-green-100 border border-green-700"
                }`}>
                  {course.status === "Draft" ? <HiClock /> : <FaCheckCircle />}
                  <span>{course.status}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-richblack-5 mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-300 mb-3 line-clamp-2">
                    {course.courseDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-richblack-400">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {formatDate(course.createdAt)}
                    </span>
                    <span className="flex items-center gap-2">
                      <HiClock />
                      {formatDuration(course.totalDuration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-richblack-700">
                  <div className="flex items-center text-2xl font-bold text-yellow-50">
                    <BsCurrencyRupee />
                    <span>{course.price}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/edit-course/${course._id}`);
                      }}
                      title="Edit"
                      className="px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-yellow-50 rounded-lg font-medium flex 
                                items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiEdit2 />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2: "All the data related to this course will be deleted",
                          btn1text: !loading ? "Delete" : "Loading...",
                          btn1Icon: !loading ? <FaTrash/> : null,
                          btn2text: "Cancel",
                          btn1handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                          btn2handler: !loading ? () => setConfirmationModal(null) : () => {},
                        })
                      }}
                      title="Delete"
                      className="px-4 py-2 bg-richblack-700 hover:bg-red-900 text-richblack-5 hover:text-red-100 rounded-lg 
                                font-medium flex items-center gap-2 transition-all duration-200 disabled:opacity-50 
                                disabled:cursor-not-allowed"
                    >
                      <RiDeleteBin6Line />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
	  {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CoursesTable;