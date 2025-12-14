import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCatalogPageData, fetchCourseCategories } from '../services/operations/catalogAPI'
import CourseCard from '../components/core/Catalog/CourseCard'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import CategoryFilter from '../components/core/Catalog/CategoryFilter'
import { FaBook, FaFilter, FaGraduationCap, FaChevronRight } from 'react-icons/fa'
import ColourText from '../components/core/HomePage/ColourText'

const Catalog = () => {
  const { catalogName } = useParams()
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  // Combine all related states into a single state object
  const [catalogData, setCatalogData] = useState({
    allCategories: null,
    selectedCategory: null,
    differentCategories: [],
    mostSellingCourses: []
  });

  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true)
      
      try {
        if(catalogName){
          const res = await getCatalogPageData(catalogName);
          // Single state update instead of multiple
          setCatalogData({
            allCategories: null,
            selectedCategory: res?.selectedCategory,
            differentCategories: res?.differentCategories || [],
            mostSellingCourses: res?.topCourses || []
          });
        } else {
          const res = await fetchCourseCategories();
          // Single state update instead of multiple
          setCatalogData({
            allCategories: res?.allCategoryDetails || [],
            selectedCategory: null,
            differentCategories: [],
            mostSellingCourses: res?.topCourses || []
          });
        }
      } catch (error) {
        console.log("Could not fetch category details")
      }
      setLoading(false)
    }
    getCategoryDetails()
  }, [catalogName])

  // Destructure for easier access
  const { allCategories, selectedCategory, differentCategories, mostSellingCourses } = catalogData;

  // Calculate allCourses only when in allCategories mode
  const allCourses = allCategories 
    ? allCategories.reduce((acc, category) => {
        return acc.concat(category.courses || []);
      }, []) 
    : [];
  
    
  // Get courses to display based on mode
  const coursesToDisplay = allCategories ? allCourses : (selectedCategory?.courses || []);
  const hasCourses = coursesToDisplay.length > 0;
  const filteredCourses = (activeFilter === "all") ? 
                              coursesToDisplay : coursesToDisplay.filter((course) => course.category?._id === activeFilter) ;


  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section - Reduced padding */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto py-6 lg:py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span className={`${allCategories? "text-richblack-50": ""}`}>Catalog</span>
            {catalogName && selectedCategory && (
              <>
                <FaChevronRight className="text-xs" />
                <span className="text-richblack-50">{selectedCategory?.name}</span>
              </>
            )}
          </div>

          {/* Title Section - Reduced spacing */}
          <div className="mb-5">
            <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
              {allCategories ? (
                <>Explore Our <ColourText text="Course Catalog" /></>
              ) : (
                <>{selectedCategory?.name} <ColourText text="Courses" /></>
              )}
            </h1>
            <p className="text-richblack-200 font-inter text-sm max-w-3xl">
              {allCategories 
                ? "Discover our comprehensive collection of courses designed to help you master in-demand skills."
                : selectedCategory?.description || "Master the skills you need with expert-led courses."}
            </p>
          </div>

          {/* Stats Cards - More compact */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                            hover:bg-richblack-700 transition-all duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaBook className="text-yellow-50 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Courses</p>
                  <p className="text-white text-lg lg:text-xl font-bold">
                    {allCategories 
                      ? allCourses?.length || 0
                      : selectedCategory?.courses?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                            hover:bg-richblack-700 transition-all duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaGraduationCap className="text-caribbeangreen-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Instructors</p>
                  <p className="text-white text-lg lg:text-xl font-bold">50+</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
                            hover:bg-richblack-700 transition-all duration-300 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
                  <FaFilter className="text-blue-200 text-sm lg:text-base" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs">Categories</p>
                  <p className="text-white text-lg lg:text-xl font-bold">
                    {allCategories 
                      ? allCategories.length 
                      : 1 + differentCategories.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Reduced top padding */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        {/* Category Filter */}
        {allCategories &&  allCategories?.length > 0 && (
          <div className="mb-8">
            <CategoryFilter 
              categories={allCategories}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
        )}

        {/* Courses Section */}
        {hasCourses ? (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                  {allCategories ? "All Courses" : "Available Courses"}
                </h2>
                <p className="text-richblack-300 font-inter text-sm">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} to explore
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-richblack-700 rounded-full flex items-center justify-center">
                <FaBook className="text-richblack-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white font-inter mb-3">
                No Courses Available
              </h3>
              <p className="text-richblack-300 font-inter">
                We're working on adding new courses to this category. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* Most Selling Courses */}
        {mostSellingCourses && mostSellingCourses.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                Most Popular <ColourText text="Courses" />
              </h2>
              <p className="text-richblack-300 font-inter text-sm">
                Top-rated courses chosen by thousands of learners
              </p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <CourseSlider courses={mostSellingCourses} />
            </div>
          </div>
        )}

        {/* Other Categories */}
        {differentCategories && differentCategories.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                Explore More <ColourText text="Categories" />
              </h2>
              <p className="text-richblack-300 font-inter text-sm">
                Discover courses across different domains and technologies
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {differentCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 
                             hover:bg-richblack-700 hover:border-richblack-600
                             transition-all duration-300 cursor-pointer group
                             shadow-[0_0_20px_rgba(255,255,255,0.02)]
                             hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  onClick={() => window.location.href = `/catalog/${category.name.toLowerCase().replace(/ /g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white font-inter 
                                   group-hover:text-yellow-50 transition-colors">
                      {category.name}
                    </h3>
                    <FaChevronRight className="text-richblack-400 group-hover:text-yellow-50 
                                               group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-richblack-300 font-inter text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-richblack-700 group-hover:bg-richblack-600 
                                    rounded-full transition-colors">
                      <p className="text-yellow-50 text-xs font-semibold">
                        {category.courses?.length || 0} {category.courses?.length === 1 ? 'course' : 'courses'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog