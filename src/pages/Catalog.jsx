import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCatalogPageData } from '../services/operations/catalogAPI'
import CourseCard from '../components/core/Catalog/CourseCard'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import CategoryFilter from '../components/core/Catalog/CategoryFilter'
import { FaBook, FaFilter, FaGraduationCap, FaChevronRight } from 'react-icons/fa'
import ColourText from '../components/core/HomePage/ColourText'

const Catalog = () => {
  const { catalogName } = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true)
      try {
        const res = await getCatalogPageData(catalogName)
        console.log("Category Details fetched:", res)
        setCatalogPageData(res)
        setCategoryId(res?.selectedCategory?._id)
      } catch (error) {
        console.log("Could not fetch category details")
      }
      setLoading(false)
    }
    
    if (catalogName) {
      getCategoryDetails()
    }
  }, [catalogName])

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
 
  const isAllCourses = !catalogName
  const selectedCategory = catalogPageData?.selectedCategory
  const differentCourses = catalogPageData?.differentCategories
  const mostSellingCourses = catalogPageData?.mostSellingCourses

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-6">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span>Catalog</span>
            {!isAllCourses && (
              <>
                <FaChevronRight className="text-xs" />
                <span className="text-richblack-50">{selectedCategory?.name}</span>
              </>
            )}
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <h1 className="lg:text-4xl text-3xl font-bold text-white font-inter mb-4">
              {isAllCourses ? (
                <>Explore Our <ColourText text="Course Catalog" /></>
              ) : (
                <>{selectedCategory?.name} <ColourText text="Courses" /></>
              )}
            </h1>
            <p className="text-richblack-200 font-inter lg:text-base text-sm max-w-3xl">
              {isAllCourses 
                ? "Discover our comprehensive collection of courses designed to help you master in-demand skills and advance your career."
                : selectedCategory?.description || "Master the skills you need with expert-led courses and hands-on projects."}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-4 lg:p-6 
                            hover:bg-richblack-700 transition-all duration-300
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaBook className="text-yellow-50 text-lg" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs lg:text-sm">Total Courses</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">
                    {selectedCategory?.courses?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-4 lg:p-6 
                            hover:bg-richblack-700 transition-all duration-300
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaGraduationCap className="text-caribbeangreen-200 text-lg" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs lg:text-sm">Expert Instructors</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">50+</p>
                </div>
              </div>
            </div>

            <div className="bg-richblack-800 border border-richblack-700 rounded-lg p-4 lg:p-6 
                            hover:bg-richblack-700 transition-all duration-300
                            shadow-[0_0_20px_rgba(255,255,255,0.02)] col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaFilter className="text-blue-200 text-lg" />
                </div>
                <div>
                  <p className="text-richblack-300 text-xs lg:text-sm">Categories</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">
                    {differentCourses?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-12">
        {/* Category Filter */}
        {!isAllCourses && differentCourses && differentCourses.length > 0 && (
          <div className="mb-12">
            <CategoryFilter 
              categories={differentCourses}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>
        )}

        {/* Courses Section */}
        {selectedCategory?.courses && selectedCategory.courses.length > 0 ? (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-2">
                  {isAllCourses ? "All Courses" : "Available Courses"}
                </h2>
                <p className="text-richblack-300 font-inter">
                  {selectedCategory.courses.length} {selectedCategory.courses.length === 1 ? 'course' : 'courses'} to explore
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {selectedCategory.courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16">
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
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-2">
                Most Popular <ColourText text="Courses" />
              </h2>
              <p className="text-richblack-300 font-inter">
                Top-rated courses chosen by thousands of learners
              </p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]">
              <CourseSlider courses={mostSellingCourses} />
            </div>
          </div>
        )}

        {/* Other Categories */}
        {differentCourses && differentCourses.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-2">
                Explore More <ColourText text="Categories" />
              </h2>
              <p className="text-richblack-300 font-inter">
                Discover courses across different domains and technologies
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {differentCourses.map((category) => (
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