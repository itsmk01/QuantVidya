import React from 'react'
import { FaStar } from 'react-icons/fa'
import ColourText from '../HomePage/ColourText'

const CourseBenefits = ({ whatYouWillLearn }) => {
  if (!whatYouWillLearn) return null

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white font-inter mb-6">
          What You'll <ColourText text="Learn" />
        </h2>

        <div className="space-y-3">
          {whatYouWillLearn.split('\n').map((item, index) => {
            if (!item.trim()) return null
            return (
              <div 
                key={index} 
                className="flex items-start gap-3 text-richblack-200 font-inter"
              >
                <FaStar className="text-yellow-50 mt-1 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CourseBenefits