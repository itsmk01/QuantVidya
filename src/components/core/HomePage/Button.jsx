import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children, active, path, className}) => {
  return (
    <div>
        <Link to={path}>
            <div className={`border-gray-950 border-1 rounded-sm lg:px-4 lg:py-2 lg:text-lg 
                            md:text-base px-2 py-2 text-xs 
                            hover:cursor-pointer hover:scale-93 font-semibold 
                            shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]
                            transition-all duration-300 ${className}
                            ${active ? "bg-amber-400 text-black hover:bg-amber-300":" bg-richblack-800 text-white hover:bg-richblack-700"}`}>
                {children}
            </div>
        </Link>
    </div>
  )
}

export default Button