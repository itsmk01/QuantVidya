import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from '../../../../services/operations/settingsAPI'
import { FaEdit, FaSave } from "react-icons/fa"
import { MdEmail, MdPhone } from "react-icons/md"

const EditProfile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: user?.additionalDetails?.about || '',
    contactNumber: user?.additionalDetails?.contactNumber || '',
    gender: user?.additionalDetails?.gender || '',
    dateOfBirth: user?.additionalDetails?.dateOfBirth || ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        about: user.additionalDetails?.about || '',
        contactNumber: user.additionalDetails?.contactNumber || '',
        gender: user.additionalDetails?.gender || '',
        dateOfBirth: user.additionalDetails?.dateOfBirth || ''
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('firstName', profileData.firstName)
    formData.append('lastName', profileData.lastName)
    formData.append('gender', profileData.gender)
    formData.append('dateOfBirth', profileData.dateOfBirth)
    formData.append('about', profileData.about)
    formData.append('contactNumber', profileData.contactNumber)
    
    const result = await dispatch(updateProfile(formData))
    
    if (result.success) {
      setIsEditingProfile(false)
    }
  }

  return (
    <div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300'>
      <div className='lg:px-10 lg:py-8 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-richblack-700 rounded-lg'>
              <FaEdit className="text-yellow-50 text-lg" />
            </div>
            <h2 className='text-xl font-semibold text-richblack-5'>Profile Information</h2>
          </div>
          
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className='bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 cursor-pointer'
            >
              <FaEdit />
              Edit
            </button>
          ) : (
            <div className='flex gap-2'>
              <button
                onClick={handleProfileSubmit}
                className='bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-all duration-200 cursor-pointer'
              >
                <FaSave />
                Save
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                className='bg-richblack-700 text-richblack-200 px-4 py-2 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 cursor-pointer'
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* First Name */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 block'>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200'
              />
            </div>

            {/* Last Name */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 block'>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200'
              />
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 flex items-center gap-2'>
                <MdEmail />
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 opacity-60 cursor-not-allowed'
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 flex items-center gap-2'>
                <MdPhone />
                Phone Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                placeholder="Add phone number"
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200'
              />
            </div>

            {/* Gender */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 block'>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200'
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className='text-sm text-richblack-200 mb-2 block'>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200'
              />
            </div>

            {/* About (Full Width) */}
            <div className='lg:col-span-2'>
              <label className='text-sm text-richblack-200 mb-2 block'>About</label>
              <textarea
                name="about"
                value={profileData.about}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
                placeholder="Write something about yourself..."
                rows="4"
                className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 resize-none'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile