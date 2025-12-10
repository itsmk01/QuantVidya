import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaBell, FaShieldAlt } from "react-icons/fa"
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'

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
    <div className='min-h-[calc(100vh-3.5rem)] bg-richblack-900 pb-12'>
      {/* Hero Section */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className='w-11/12 max-w-[1000px] mx-auto -mt-16 relative z-10'>
        {/* Page Header */}
        <div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6'>
          <div className='lg:px-10 lg:py-8 p-6'>
            <h1 className='text-3xl font-bold text-richblack-5 mb-2'>Account Settings</h1>
            <p className='text-richblack-300'>Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Profile Picture Section */}
        <ChangeProfilePicture />

        {/* Profile Information Section */}
        <EditProfile />

        {/* Change Password Section */}
        <UpdatePassword />

        {/* Notification Settings */}
        <div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300'>
          <div className='lg:px-10 lg:py-8 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-2 bg-richblack-700 rounded-lg'>
                <FaBell className="text-yellow-50 text-lg" />
              </div>
              <h2 className='text-xl font-semibold text-richblack-5'>Notification Preferences</h2>
            </div>
            
            <div className='space-y-4'>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className='flex items-center justify-between p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200'>
                  <div>
                    <p className='text-richblack-5 font-medium capitalize'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className='text-sm text-richblack-300'>
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'pushNotifications' && 'Receive push notifications in browser'}
                      {key === 'courseUpdates' && 'Get notified about course updates'}
                      {key === 'promotions' && 'Receive promotional offers and deals'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key)}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                      value ? 'bg-green-500' : 'bg-richblack-600'
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