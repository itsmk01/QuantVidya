import React from "react";
import {
  FaChevronRight,
  FaStar,
  FaUsers,
  FaClock,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ColourText from "../HomePage/ColourText";
import { formatDate } from "../../../services/formatDate";

const CourseDetailsHero = ({ courseData, isEnrolled }) => {
  const navigate = useNavigate();

  const ratings = courseData.ratingAndReviews || [];

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((total, review) => total + review.rating, 0) /
        ratings.length
      : 0;

  const totalReviews = ratings.length;

  return (
    <div className="relative bg-richblack-900 border-b border-richblack-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-caribbeangreen-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-11/12 max-w-[1260px] mx-auto py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-richblack-400 text-sm mb-6 font-inter flex-wrap">
          <span
            onClick={() => navigate("/")}
            className="hover:text-yellow-50 cursor-pointer transition-colors"
          >
            Home
          </span>
          <FaChevronRight className="text-xs" />
          <span
            onClick={() => navigate("/catalog")}
            className="hover:text-yellow-50 cursor-pointer transition-colors"
          >
            Catalog
          </span>
          <FaChevronRight className="text-xs" />
          <span
            onClick={() =>
              navigate(
                `/catalog/${courseData.category?.name
                  .split(" ")
                  .join("-")
                  .toLowerCase()}`
              )
            }
            className="hover:text-yellow-50 cursor-pointer transition-colors"
          >
            {courseData.category.name}
          </span>
          <FaChevronRight className="text-xs" />
          <span className="text-yellow-50 font-medium truncate">
            {courseData.courseName}
          </span>
        </div>

        {/* Course Title & Info */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Enrollment Badge */}
            {isEnrolled && (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-caribbeangreen-800 border border-caribbeangreen-600 
                              rounded-full mb-4"
              >
                <FaCheckCircle className="text-caribbeangreen-200 text-sm" />
                <span className="text-caribbeangreen-100 text-sm font-inter font-semibold">
                  Enrolled
                </span>
              </div>
            )}

            <h1 className="text-3xl lg:text-5xl font-bold text-white font-inter mb-4 leading-tight">
              {courseData.courseName}
            </h1>

            <p className="text-richblack-200 font-inter text-base lg:text-lg leading-relaxed mb-6">
              {courseData.courseDescription}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-50 text-sm" />
                  <span className="text-white font-inter font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-richblack-300 text-sm font-inter">
                  ({totalReviews || 0} reviews)
                </span>
              </div>

              {/* Students */}
              <div className="flex items-center gap-2">
                <FaUsers className="text-caribbeangreen-200 text-sm" />
                <span className="text-richblack-200 text-sm font-inter">
                  {courseData.studentsEnrolled?.length || 0} students
                </span>
              </div>

              {/* Language */}
              <div className="flex items-center gap-2">
                <FaGlobe className="text-blue-200 text-sm" />
                <span className="text-richblack-200 text-sm font-inter">
                  {courseData.language || "English"}
                </span>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex items-center gap-3">
              <span className="text-richblack-300 text-sm font-inter">
                Created by
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={courseData.instructor?.additionalDetails?.image || "/default-avatar.png"}
                  alt={courseData.instructor?.firstName}
                  className="w-8 h-8 rounded-full border-2 border-richblack-700"
                />
                <span className="text-yellow-50 font-inter font-semibold">
                  {courseData.instructor?.firstName}{" "}
                  {courseData.instructor?.lastName}
                </span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-4">
              <span className="text-richblack-400 text-sm font-inter">
                Last updated{" "}
                {formatDate(courseData.updatedAt || courseData.createdAt)}
              </span>
            </div>
          </div>

          {/* Course Preview Image */}
          <div className="lg:block hidden">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-richblack-700 
                            shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300"
            >
              <img
                src={courseData.thumbnail}
                alt={courseData.courseName}
                className="w-full h-64 object-cover"
              />
              {/* Price Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-richblack-900 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-richblack-300 text-sm font-inter mb-1">
                      Price
                    </p>
                    <p className="text-3xl font-bold text-yellow-50 font-inter">
                      ₹{courseData.price}
                    </p>
                  </div>
                  {courseData.category && (
                    <div className="px-4 py-2 bg-richblack-800 rounded-full border border-richblack-700">
                      <span className="text-richblack-200 text-sm font-inter font-semibold">
                        {courseData.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsHero;
