import React from 'react'
import { FaFilter } from 'react-icons/fa'

const CategoryFilter = ({ categories, activeFilter, setActiveFilter }) => {
  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-8">
      <div className="lg:px-10 lg:py-6 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaFilter className="text-yellow-50 text-lg" />
          <h3 className="text-lg font-semibold text-richblack-5">Filter by Category</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* All Filter */}
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeFilter === "all"
                ? 'bg-yellow-50 text-richblack-900 shadow-lg'
                : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
            }`}
          >
            All Courses
          </button>

          {/* Category Filters */}
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveFilter(category._id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeFilter === category._id
                  ? 'bg-yellow-50 text-richblack-900 shadow-lg'
                  : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">
                ({category.courses?.length || 0})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter