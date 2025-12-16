import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaTrash, FaArrowRight, FaTag, FaClock, FaChevronRight, FaCertificate, FaHeadset, FaInfinity } from 'react-icons/fa'
import { BsCurrencyRupee } from 'react-icons/bs'
import { removeFromCart } from '../../../slices/cartSlice'
import ColourText from '../HomePage/ColourText'
import { buyCourse } from '../../../services/operations/paymentAPI'
import toast from 'react-hot-toast'
import { ACCOUNT_TYPE } from '../../../utils/constant'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cart, total, totalItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  const handleBuyCourse = async () => {
    const courses = cart.map((course) => course._id)
     if (!user) {
      toast.error('Please login to purchase')
      navigate('/login')
      return
    }

    if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
        toast.error("Instructors cannot purchase courses");
        return;
    }

    if (user) {
      setLoading(true)
      await buyCourse(courses , user, navigate, dispatch)
      setLoading(false)
    }
  }

  const handleRemoveFromCart = (courseId) => {
    dispatch(removeFromCart(courseId))
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto pt-6 lg:pt-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span>Dashboard</span>
            <FaChevronRight className="text-xs" />
            <span className="text-richblack-50">Cart</span>
          </div>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-5">
            <div>
              <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
                Shopping <ColourText text="Cart" />
              </h1>
              <p className="text-richblack-200 font-inter text-sm">
                {totalItems} {totalItems === 1 ? 'Course' : 'Courses'} in your cart
              </p>
            </div>
            <button
              onClick={() => navigate("/catalog")}
              className="bg-yellow-50 text-richblack-900 px-5 py-2.5 rounded-lg font-semibold 
                       flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 
                       hover:scale-105 shadow-md text-sm self-start md:self-center"
            >
              <FaShoppingCart className="text-sm" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-8">
        {cart && cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((course) => (
                <div
                  key={course._id}
                  className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden 
                           shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                           transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-full sm:w-48 h-32 rounded-lg overflow-hidden group">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg lg:text-xl font-bold text-richblack-5 mb-2 font-inter">
                            {course.courseName}
                          </h3>
                          <p className="text-richblack-300 text-sm mb-3 line-clamp-2 font-inter">
                            {course.courseDescription}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-richblack-400">
                            <span className="flex items-center gap-1.5">
                              <FaClock className="text-xs" />
                              {course.totalDuration || 'Duration N/A'}
                            </span>
                            <span className="px-2 py-1 bg-richblack-700 rounded-full text-xs">
                              {course.category?.name || 'Category'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-richblack-700">
                          <div className="flex items-center text-xl lg:text-2xl font-bold text-yellow-50">
                            <BsCurrencyRupee />
                            <span>{course.price}</span>
                          </div>

                          <button
                            onClick={() => handleRemoveFromCart(course._id)}
                            className="px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-300 hover:text-red-400 
                                     rounded-lg font-medium flex items-center gap-2 transition-all duration-200 text-sm"
                          >
                            <FaTrash className="text-xs" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Order Summary */}
              <div className="bg-richblack-800 border border-richblack-700 rounded-xl 
                            shadow-[0_0_20px_rgba(255,255,255,0.02)] lg:sticky lg:top-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-richblack-5 mb-6 pb-4 border-b border-richblack-700 font-inter">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-richblack-300 text-sm">
                      <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                      <div className="flex items-center font-semibold text-richblack-5">
                        <BsCurrencyRupee className="text-sm" />
                        <span>{total}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-richblack-300 text-sm">
                      <span>Discount</span>
                      <div className="flex items-center font-semibold text-caribbeangreen-200">
                        <BsCurrencyRupee className="text-sm" />
                        <span>0</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-richblack-700">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-richblack-5">Total</span>
                        <div className="flex items-center text-yellow-50">
                          <BsCurrencyRupee />
                          <span>{total}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyCourse}
                    disabled={loading}
                    className="w-full bg-yellow-50 text-richblack-900 py-3 rounded-lg font-semibold flex items-center 
                              justify-center gap-2 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 
                              shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? 'Processing...' : 'Buy Now'}</span>
                    {!loading && <FaArrowRight className="text-sm" />}
                  </button>

                  <p className="text-richblack-400 text-xs text-center mt-4 font-inter">
                    30-day money-back guarantee
                  </p>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 
                            shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-richblack-700 rounded-lg">
                    <FaTag className="text-yellow-50" />
                  </div>
                  <h3 className="text-base font-semibold text-richblack-5 font-inter">Special Offer</h3>
                </div>
                <p className="text-richblack-300 text-sm font-inter">
                  Get 20% off on your first purchase! Use code: <span className="text-yellow-50 font-semibold">FIRST20</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-richblack-800 border border-richblack-700 rounded-xl 
                        shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
            <div className="lg:px-10 lg:py-8 p-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-richblack-700 rounded-full flex items-center justify-center">
                  <FaShoppingCart className="text-richblack-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-semibold text-richblack-5 mb-2 font-inter">
                  Your Cart is Empty
                </h3>
                <p className="text-richblack-300 mb-6 font-inter">
                  Add courses to your cart to start learning
                </p>
                <button
                  onClick={() => navigate("/catalog")}
                  className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Why Learn With Us */}
        {cart && cart.length > 0 && (
          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
                Why Learn <ColourText text="With Us?" />
              </h2>
              <p className="text-richblack-300 font-inter text-sm">
                Benefits you get with every course
              </p>
            </div>

            <div className='bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
                          shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaInfinity className="text-yellow-50 text-lg" />
                    </div>
                    <h3 className="text-richblack-5 font-semibold font-inter">Lifetime Access</h3>
                  </div>
                  <p className="text-richblack-400 text-sm font-inter">Learn at your own pace with unlimited access</p>
                </div>

                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaCertificate className="text-yellow-50 text-lg" />
                    </div>
                    <h3 className="text-richblack-5 font-semibold font-inter">Certificate</h3>
                  </div>
                  <p className="text-richblack-400 text-sm font-inter">Earn a certificate upon course completion</p>
                </div>

                <div className="p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-richblack-800 rounded-lg">
                      <FaHeadset className="text-yellow-50 text-lg" />
                    </div>
                    <h3 className="text-richblack-5 font-semibold font-inter">Expert Support</h3>
                  </div>
                  <p className="text-richblack-400 text-sm font-inter">Get help from instructors and community</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart