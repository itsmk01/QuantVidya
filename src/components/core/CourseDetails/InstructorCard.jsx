import React from 'react'
import { FaStar, FaUsers, FaPlayCircle, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'

const InstructorCard = ({ instructor }) => {
  if (!instructor) return null

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-6">
          Meet Your <ColourText text="Instructor" />
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Instructor Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img 
                src={instructor.additionalDetails.image || '/default-avatar.png'} 
                alt={`${instructor.firstName} ${instructor.lastName}`}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-richblack-700
                           shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              />
              {/* Online Badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-caribbeangreen-400 
                              text-richblack-900 rounded-full text-xs font-semibold">
                Active
              </div>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white font-inter mb-2">
              {instructor.firstName} {instructor.lastName}
            </h3>
            
            {instructor.additionalDetails?.profession && (
              <p className="text-yellow-50 font-inter font-medium mb-3">
                {instructor.additionalDetails.profession}
              </p>
            )}

            {instructor.additionalDetails?.about && (
              <p className="text-richblack-300 font-inter text-sm leading-relaxed mb-4">
                {instructor.additionalDetails.about}
              </p>
            )}

            {/* Instructor Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaStar className="text-yellow-50 text-sm" />
                </div>
                <div>
                  <p className="text-white font-inter font-semibold text-sm">4.8</p>
                  <p className="text-richblack-400 text-xs font-inter">Rating</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaUsers className="text-caribbeangreen-200 text-sm" />
                </div>
                <div>
                  <p className="text-white font-inter font-semibold text-sm">
                    {instructor.courses?.length || 0}
                  </p>
                  <p className="text-richblack-400 text-xs font-inter">Courses</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-richblack-700 rounded-lg">
                  <FaPlayCircle className="text-blue-200 text-sm" />
                </div>
                <div>
                  <p className="text-white font-inter font-semibold text-sm">10K+</p>
                  <p className="text-richblack-400 text-xs font-inter">Students</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {instructor.additionalDetails?.linkedinProfile && (
                <a 
                  href={instructor.additionalDetails.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-richblack-700 hover:bg-richblack-600 rounded-lg 
                             transition-all duration-200"
                >
                  <FaLinkedin className="text-blue-400 text-lg" />
                </a>
              )}
              {instructor.additionalDetails?.twitterProfile && (
                <a 
                  href={instructor.additionalDetails.twitterProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-richblack-700 hover:bg-richblack-600 rounded-lg 
                             transition-all duration-200"
                >
                  <FaTwitter className="text-blue-400 text-lg" />
                </a>
              )}
              {instructor.additionalDetails?.website && (
                <a 
                  href={instructor.additionalDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-richblack-700 hover:bg-richblack-600 rounded-lg 
                             transition-all duration-200"
                >
                  <FaGlobe className="text-caribbeangreen-200 text-lg" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorCard