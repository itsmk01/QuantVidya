import React from 'react'
import { FaStar, FaUserCircle } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'

const ReviewsSection = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                      shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="p-6 lg:p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-4">
            Student <ColourText text="Reviews" />
          </h2>
          <p className="text-richblack-300 font-inter">
            No reviews yet. Be the first to review this course!
          </p>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index}
        className={index < rating ? 'text-yellow-50' : 'text-richblack-600'}
      />
    ))
  }

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-6">
          Student <ColourText text="Reviews" />
        </h2>

        <div className="space-y-6">
          {reviews.slice(0, 5).map((review, index) => (
            <div 
              key={review._id || index}
              className="pb-6 border-b border-richblack-700 last:border-b-0"
            >
              {/* Reviewer Info */}
              <div className="flex items-start gap-4 mb-3">
                {review.user?.additionalDetails.image ? (
                  <img 
                    src={review.user.additionalDetails.image} 
                    alt={review.user.firstName}
                    className="w-12 h-12 rounded-full border-2 border-richblack-700"
                  />
                ) : (
                  <FaUserCircle className="text-richblack-600 text-5xl" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-inter font-semibold">
                      {review.user?.firstName} {review.user?.lastName}
                    </h4>
                    <div className="flex gap-1 text-sm">
                      {renderStars(review.rating || 5)}
                    </div>
                  </div>
                  
                  <p className="text-richblack-300 font-inter text-sm leading-relaxed">
                    {review.review}
                  </p>
                  
                  {review.createdAt && (
                    <p className="text-richblack-400 font-inter text-xs mt-2">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 5 && (
          <button className="mt-6 w-full py-3 bg-richblack-700 hover:bg-richblack-600 
                             text-white font-inter font-semibold rounded-lg 
                             transition-all duration-200 border border-richblack-600">
            View All Reviews ({reviews.length})
          </button>
        )}
      </div>
    </div>
  )
}

export default ReviewsSection