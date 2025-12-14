import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaChartLine,
  FaRupeeSign,
  FaArrowUp,
  FaChevronRight,
} from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { getInstructorData } from "../../../services/operations/userAPI";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import ColourText from "../../../components/core/HomePage/ColourText";
import CourseCard from "../Catalog/CourseCard";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData();
      const result = await fetchInstructorCourses();

      if (instructorApiData) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalStudents = instructorData?.totalStudents || 0;
  const totalIncome = instructorData?.totalIncome || 0;
  const totalCourses = courses?.length || 0;
  const hasCourses = courses && courses.length > 0;

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
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
            <span className="text-richblack-50">Instructor</span>
          </div>

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-5">
            <div>
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                Hi {user?.firstName} <ColourText text="👋" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                {hasCourses
                  ? "Let's start something new"
                  : "Ready to create your first course?"}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/add-course")}
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
            <div
              className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaBook className="text-yellow-50 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Total Courses</p>
                  <p className="text-white text-lg lg:text-xl font-bold">
                    {totalCourses}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaUsers className="text-caribbeangreen-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Total Students</p>
                  <p className="text-white text-lg lg:text-xl font-bold">
                    {totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                          hover:bg-richblack-700 transition-all duration-300 col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaRupeeSign className="text-blue-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Total Income</p>
                  <p className="text-white text-base lg:text-lg font-bold">
                    ₹{totalIncome?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        {/* Charts Section - Only show if courses exist */}
        {hasCourses && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                <ColourText text="Visualize" /> Performance
              </h2>
              <p className="text-richblack-300 font-inter text-sm">
                Track your teaching analytics
              </p>
            </div>

            <div
              className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
                          shadow-[0_0_20px_rgba(255,255,255,0.02)]"
            >
              <div className="flex justify-between items-center mb-6">
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
                  <p className="text-richblack-300">
                    Chart will be displayed here
                  </p>
                  <p className="text-richblack-400 text-sm mt-2">
                    Integrate with Chart.js or Recharts
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                Your <ColourText text="Courses" />
              </h2>
              <p className="text-richblack-300 font-inter text-sm">
                {hasCourses
                  ? "Manage and track your courses"
                  : "Start your teaching journey"}
              </p>
            </div>
            {hasCourses && (
              <button
                onClick={() => navigate("/dashboard/my-courses")}
                className="text-yellow-50 hover:text-yellow-100 text-sm font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <FaArrowUp className="rotate-45 text-xs" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {hasCourses ? (
              courses
                .slice(0, 4)
                .map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-6 bg-richblack-700 rounded-full mb-4">
                  <FaBook className="text-richblack-400 text-5xl" />
                </div>
                <h3 className="text-richblack-5 text-lg font-semibold mb-2 font-inter">
                  No courses yet
                </h3>
                <p className="text-richblack-300 mb-6 max-w-md mx-auto text-sm font-inter">
                  Start your teaching journey by creating your first course.
                  Share your knowledge with students around the world.
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
        <div>
          <div className="mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
              Quick <ColourText text="Actions" />
            </h2>
            <p className="text-richblack-300 font-inter text-sm">
              Frequently used features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => navigate("/dashboard/my-courses")}
              className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 
                       hover:bg-richblack-700 hover:border-richblack-600 transition-all duration-300 
                       cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.02)]
                       hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-richblack-700 rounded-lg">
                    <FaBook className="text-yellow-50 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-richblack-5 font-semibold mb-1 font-inter">
                      {hasCourses ? "Manage Courses" : "My Courses"}
                    </h3>
                    <p className="text-richblack-400 text-sm font-inter">
                      {hasCourses
                        ? "Edit and update your courses"
                        : "View all your courses"}
                    </p>
                  </div>
                </div>
                <FaChevronRight
                  className="text-richblack-400 group-hover:text-yellow-50 
                                         group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>

            <div
              onClick={() => navigate("/dashboard/settings")}
              className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 
                       hover:bg-richblack-700 hover:border-richblack-600 transition-all duration-300 
                       cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.02)]
                       hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-richblack-700 rounded-lg">
                    <FaUsers className="text-yellow-50 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-richblack-5 font-semibold mb-1 font-inter">
                      Profile Settings
                    </h3>
                    <p className="text-richblack-400 text-sm font-inter">
                      Update your profile information
                    </p>
                  </div>
                </div>
                <FaChevronRight
                  className="text-richblack-400 group-hover:text-yellow-50 
                                         group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
