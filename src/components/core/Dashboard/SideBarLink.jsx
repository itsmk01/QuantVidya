import React from 'react'
import * as VscIcons from "react-icons/vsc";
import * as FiIcons from "react-icons/fi";
import { useLocation, matchPath, NavLink } from 'react-router-dom';

const SideBarLink = ({ link, iconName, isCollapsed }) => {
  const Icon = VscIcons[iconName] || FiIcons[iconName];
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      className={`
        group relative flex items-center 
        ${isCollapsed ? 'justify-center px-3 py-3' : 'px-8 py-2'} 
        rounded-lg cursor-pointer transition-all duration-200 
        ${isActive ? 'bg-yellow-800 text-yellow-50' : 'text-richblack-200 hover:bg-richblack-800 hover:text-white'}
      `}
    >
      {/* Active border indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-0.5 bg-yellow-50 transition-opacity duration-200
          ${isActive ? 'opacity-100' : 'opacity-0'}`}
      ></span>

      {/* Icon */}
      <Icon className="text-lg shrink-0" />

      {/* Link Text (hidden when collapsed) */}
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium">{link.name}</span>
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-richblack-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-20">
          {link.name}
        </div>
      )}
    </NavLink>
  );
};

export default SideBarLink;
