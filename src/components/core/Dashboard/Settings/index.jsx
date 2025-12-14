import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaBell, FaChevronRight } from "react-icons/fa"
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'
import ColourText from '../../HomePage/ColourText'

const Settings = () => {
  const { user, loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    promotions: false
  })

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner"></div>
          <p className="text-richblack-200 animate-pulse">Loading settings...</p>
        </div>
      </div>
    )
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  return (
    <div className='min-h-[calc(100vh-3.5rem)] bg-richblack-900'>
      {/* Hero Section */}
      <div className="bg-richblack-900 border-b border-richblack-800">
        <div className="w-11/12 max-w-[1260px] mx-auto pt-6 lg:pt-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span>Dashboard</span>
            <FaChevronRight className="text-xs" />
            <span className="text-richblack-50">Settings</span>
          </div>

          {/* Title Section */}
          <div className="mb-5">
            <h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
              Account <ColourText text="Settings" />
            </h1>
            <p className="text-richblack-200 font-inter text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-11/12 max-w-[1260px] mx-auto py-8 space-y-8'>
        {/* Profile Picture Section */}
        <ChangeProfilePicture />

        {/* Profile Information Section */}
        <EditProfile />

        {/* Change Password Section */}
        <UpdatePassword />

        {/* Notification Settings */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
              Notification <ColourText text="Preferences" />
            </h2>
            <p className="text-richblack-300 font-inter text-sm">
              Manage how you receive notifications
            </p>
          </div>

          <div className='bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
                        shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
            <div className='space-y-4'>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className='flex items-center justify-between p-4 bg-richblack-700 
                                         rounded-lg hover:bg-richblack-600 transition-all duration-200'>
                  <div className="flex-1 pr-4">
                    <p className='text-richblack-5 font-medium capitalize font-inter mb-1'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className='text-sm text-richblack-300 font-inter'>
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'pushNotifications' && 'Receive push notifications in browser'}
                      {key === 'courseUpdates' && 'Get notified about course updates'}
                      {key === 'promotions' && 'Receive promotional offers and deals'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                      value ? 'bg-caribbeangreen-300' : 'bg-richblack-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        value ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <DeleteAccount />
      </div>
    </div>
  )
}

export default Settings