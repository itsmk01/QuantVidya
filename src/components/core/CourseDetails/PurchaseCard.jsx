import React, { useState } from 'react'
import { FaShoppingCart, FaCheckCircle, FaShare, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../../slices/cartSlice'
import toast from 'react-hot-toast'
import { ACCOUNT_TYPE } from '../../../utils/constant'
import { buyCourse } from '../../../services/operations/paymentAPI'

const PurchaseCard = ({ courseData, isEnrolled }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const isInCart = cart?.some(item => item._id === courseData._id)

  const handleBuyCourse = async() => {
    if (!user) {
      toast.error('Please login to purchase')
      navigate('/login')
      return
    }

    if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
        toast.error("Instructors cannot purchase courses");
        return;
    }

    if (isEnrolled) {
      navigate(`/dashboard/enrolled-courses`)
      return
    }

    
    if (user) {
      setLoading(true)
      await buyCourse([courseData._id] , user, navigate, dispatch)
      setLoading(false)
    }

    // Navigate to checkout or payment
    // navigate('/dashboard/cart')
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart')
      navigate('/login')
      return
    }

    if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
        toast.error("Instructors cannot purchase courses");
        return;
    }

    if (!isInCart) {
      dispatch(addToCart(courseData))
      toast.success('Course added to cart')
    } else {
      toast.error('Already in cart')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                      shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        {/* Course Image */}
        <div className="relative">
          <img 
            src={courseData.thumbnail} 
            alt={courseData.courseName}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShare}
              className="p-3 bg-richblack-900/80 backdrop-blur-sm rounded-full 
                         hover:bg-richblack-900 transition-all duration-200"
            >
              <FaShare className="text-white text-sm" />
            </button>
            <button className="p-3 bg-richblack-900/80 backdrop-blur-sm rounded-full 
                               hover:bg-richblack-900 transition-all duration-200">
              <FaHeart className="text-white text-sm" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Price */}
          <div className="mb-6">
            <p className="text-richblack-300 text-sm font-inter mb-1">Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-yellow-50 font-inter">
                ₹{courseData.price}
              </p>
              {courseData.originalPrice && courseData.originalPrice > courseData.price && (
                <>
                  <p className="text-xl text-richblack-400 line-through font-inter">
                    ₹{courseData.originalPrice}
                  </p>
                  <span className="px-2 py-1 bg-caribbeangreen-800 text-caribbeangreen-100 
                                 text-xs font-semibold rounded-full">
                    SAVE {Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isEnrolled ? (
              <button
                onClick={handleBuyCourse}
                className="w-full py-4 bg-caribbeangreen-400 text-richblack-900 rounded-xl 
                           font-inter font-bold text-lg hover:bg-caribbeangreen-300 
                           transition-all duration-300 hover:scale-[0.98] 
                           shadow-[0_4px_20px_rgba(5,150,105,0.3)]
                           flex items-center justify-center gap-2"
              >
                <FaCheckCircle />
                Go to Course
              </button>
            ) : (
              <>
                <button
                  onClick={handleBuyCourse}
                  className="w-full py-4 bg-yellow-50 text-richblack-900 rounded-xl 
                             font-inter font-bold text-lg hover:bg-yellow-25 
                             transition-all duration-300 hover:scale-[0.98]
                             shadow-[0_4px_20px_rgba(255,214,10,0.3)]"
                >
                  Buy Now
                </button>
                
                {!isInCart && (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-richblack-700 text-white rounded-xl 
                               font-inter font-semibold text-lg hover:bg-richblack-600 
                               transition-all duration-300 border border-richblack-600
                               flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                )}
              </>
            )}
          </div>

          {/* Course Includes */}
          <div className="mt-6 pt-6 border-t border-richblack-700">
            <h3 className="text-white font-inter font-semibold mb-4">
              This course includes:
            </h3>
            <ul className="space-y-2">
              {[
                'Lifetime access',
                'Certificate of completion',
                'Access on mobile and desktop',
                '30-day money-back guarantee',
                'Direct support from instructor'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-richblack-200 text-sm font-inter">
                  <FaCheckCircle className="text-caribbeangreen-300 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseCard