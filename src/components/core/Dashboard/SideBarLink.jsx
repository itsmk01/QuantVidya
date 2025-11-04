import React from 'react'
import * as VscIcons from "react-icons/vsc";
import * as FiIcons from "react-icons/fi";
import { useLocation, matchPath, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const SideBarLink = ({link, iconName}) => {
const Icon = VscIcons[iconName] || FiIcons[iconName];
const location = useLocation()
const dispatch = useDispatch()

const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
}

return (
    <NavLink
        to={link.path}
        className={`flex relative px-8 py-1.5 text-sm font-medium  leading-6
                    ${matchRoute(link.path) ? 
                        "bg-yellow-800 text-yellow-50"
                        : "bg-opacity-0 text-richblack-200"}
                    transition-all duration-200`}
    >
        <span 
            className={`absolute left-0 top-0 h-full w-0.5 bg-yellow-50
                ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}
        ></span>
        <div className='flex items-center justify-start gap-3'>
            <Icon className="text-lg"/>
            <span>{link.name}</span>
        </div>
    </NavLink>
)
}

export default SideBarLink