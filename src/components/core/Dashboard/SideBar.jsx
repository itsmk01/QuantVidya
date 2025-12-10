import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VscSignOut } from "react-icons/vsc"
import { sidebarLinks } from '../../../data/dashboard-links'
import SideBarLink from './SideBarLink'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'
import { logout } from '../../../services/operations/authAPI'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem-1px)] min-w-[220px] items-center border-r border-r-richblack-700 bg-richblack-900">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner"></div>
          <p className="text-richblack-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`relative text-white bg-richblack-900 border-r border-r-richblack-700 min-h-[calc(100vh-3.5rem-1px)] 
                        transition-all duration-300 ${isCollapsed ? 'w-[50px]' : 'w-[260px]'} flex flex-col`}>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-richblack-700 hover:bg-richblack-600 text-richblack-200 p-1.5 rounded-full border-2 border-richblack-900 transition-all duration-200 hover:scale-110 z-10"
        >
          {isCollapsed ? <FiChevronRight className="text-sm" /> : <FiChevronLeft className="text-sm" />}
        </button>

        {/* User Profile Section */}
        <div className={`mt-6 mx-1 mb-4 p-4 bg-gradient-to-br from-richblack-800 to-richblack-700 rounded-xl border 
                        border-richblack-600 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 p-0 m-0 overflow-hidden' 
                        : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={user?.additionalDetails?.image} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-50"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-richblack-800"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-richblack-5 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-richblack-300 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-visible scrollbar-thin scrollbar-thumb-richblack-700 scrollbar-track-transparent">
          <div className={`px-1`}>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3 px-3">
                Navigation
              </p>
            )}
            <div className='flex flex-col gap-1'>
              {sidebarLinks.map((link) => {
                if(link.type && link.type !== user.accountType) return null;
                return (
                  <SideBarLink 
                    key={link.id} 
                    link={link} 
                    iconName={link.icon}
                    isCollapsed={isCollapsed}
                  />
                )
              })}
            </div>
          </div>
        </nav>

        {/* Divider with Gradient */}
        <div className='h-[2px] w-11/12 bg-gradient-to-r from-transparent via-richblack-600 to-transparent mx-auto my-4'></div>

        {/* Bottom Section */}
        <div className={`pb-6 ${isCollapsed ? 'px-1' : 'px-2'}`}>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-richblack-400 uppercase tracking-wider mb-3 px-5">
              Account
            </p>
          )}
          
          {/* Settings Link */}
          <SideBarLink 
            link={{name: "Settings", path: "/dashboard/settings"}} 
            iconName={"VscSettingsGear"}
            isCollapsed={isCollapsed}
          />
          
          {/* Logout Button */}
          <button
            className={`group flex items-center gap-3  text-richblack-300 font-medium text-sm
                         cursor-pointer w-full rounded-lg hover:bg-richblack-800 transition-all duration-200 relative 
                         ${isCollapsed ? 'justify-center px-1 py-3' : 'justify-start px-4 py-3'}`}
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1text: "Logout",
                btn1Icon: <VscSignOut/>,
                btn2text: "Cancel",
                btn1handler: () => dispatch(logout(navigate)),
                btn2handler: () => setConfirmationModal(null),
              })
            }
          >
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/10 to-red-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            
            <VscSignOut className='text-lg relative z-10 group-hover:text-red-400 transition-colors'/>
            {!isCollapsed && (
              <span className="relative z-10 group-hover:text-red-400 transition-colors">Logout</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-richblack-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-20">
                Logout
              </div>
            )}
          </button>
        </div>

        {/* Decorative Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      </div>
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default SideBar