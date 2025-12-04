import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changePassword, updateProfile } from '../../../services/operations/settingsAPI'
import { FaEdit, FaCamera, FaTrash, FaSave, FaLock, FaBell, FaShieldAlt } from "react-icons/fa"
import { MdEmail, MdPhone } from "react-icons/md"
import { deleteAccount } from '../../../services/operations/settingsAPI'
import ConfirmationModal from '../../common/ConfirmationModal'

const Settings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { user, loading: authLoading } = useSelector((state) => state.auth)
  const { loading: profileLoading } = useSelector((state) => state.profile)
  
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  
  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: user?.additionalDetails?.about || '',
    contactNumber: user?.additionalDetails?.contactNumber || '',
    gender: user?.additionalDetails?.gender || '',
    dateOfBirth: user?.additionalDetails?.dateOfBirth || ''
  })
  
  const [profilePic, setProfilePic] = useState(null)
  const [previewImage, setPreviewImage] = useState(user?.additionalDetails?.image || '')

  // Add useEffect to sync with Redux changes
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
      setPreviewImage(user.additionalDetails?.image || '')
    }
  }, [user])
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    })
  }

  // Handler for image update
  const handleImageSubmit = async (e) => {
    e.preventDefault()
    
    if (!profilePic) {
      return
    }
    
    // Create FormData for image upload only
    const formData = new FormData()
    formData.append('profilePic', profilePic)
    
    // Dispatch update profile action
    const result = await dispatch(updateProfile(formData))
    
    if (result.success) {
      setIsEditingImage(false)
      setProfilePic(null)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    // Create FormData for profile info (without image)
    const formData = new FormData()
    formData.append('firstName', profileData.firstName)
    formData.append('lastName', profileData.lastName)
    formData.append('gender', profileData.gender)
    formData.append('dateOfBirth', profileData.dateOfBirth)
    formData.append('about', profileData.about)
    formData.append('contactNumber', profileData.contactNumber)
    
    // Dispatch update profile action
    const result = await dispatch(updateProfile(formData))
    
    if (result.success) {
      setIsEditingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    // update password service operation
    const passwordUpdated = await dispatch(changePassword(passwordData));
    console.log('Password updated');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    if (passwordUpdated.success) {
      setIsEditingPassword(false)
    }
  }

  const handleDeleteAccount = () => {
    let passwordInput = ""; // Store password in closure
    
    setConfirmationModal({
      text1: "Are you sure?",
      text2: (
        <div className="flex flex-col gap-3">
          <p>Your account will be deleted permanently.</p>
          <input
            type="password"
            placeholder="Enter your password to confirm"
            onChange={(e) => { passwordInput = e.target.value; }} // Store in closure variable
            className="w-full rounded-md bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400"
          />
        </div>
      ),
      btn1text: "Delete Account",
      btn1Icon: <FaTrash />,
      btn2text: "Cancel",
      btn1handler: () => {
        if(!passwordInput || passwordInput.trim() === ""){
          toast.error("Please enter your password");
          return;
        }
        dispatch(deleteAccount(navigate, passwordInput));
        setConfirmationModal(null);
      },
      btn2handler: () => {
        setConfirmationModal(null);
      }
    });
  };

  const handleCancelImageEdit = () => {
    setIsEditingImage(false)
    setProfilePic(null)
    setPreviewImage(user?.additionalDetails?.image || '')
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
        <div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300'>
          <div className='lg:px-10 lg:py-8 p-6'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-richblack-700 rounded-lg'>
                  <FaCamera className="text-yellow-50 text-lg" />
                </div>
                <h2 className='text-xl font-semibold text-richblack-5'>Profile Picture</h2>
              </div>
              
              {!isEditingImage ? (
                <button
                  onClick={() => setIsEditingImage(true)}
                  className='bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 cursor-pointer'
                >
                  <FaEdit />
                  Edit
                </button>
              ) : (
                <div className='flex gap-2'>
                  <button
                    onClick={handleImageSubmit}
                    disabled={!profilePic}
                    className='bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    onClick={handleCancelImageEdit}
                    className='bg-richblack-700 text-richblack-200 px-4 py-2 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 cursor-pointer'
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <div className='flex md:flex-row flex-col md:items-center gap-6'>
              <div className='relative group'>
                <img 
                  src={previewImage || user?.additionalDetails?.image} 
                  alt="Profile" 
                  className='w-24 h-24 rounded-full object-cover border-4 border-richblack-700 group-hover:border-yellow-50 transition-all duration-300'
                />
                {isEditingImage && (
                  <label 
                    htmlFor="profilePicInput"
                    className='absolute inset-0 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity duration-300 cursor-pointer'
                  >
                    <FaCamera className="text-white text-2xl" />
                  </label>
                )}
                {isEditingImage && (
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                )}
              </div>
              
              <div className='flex-1'>
                {!isEditingImage ? (
                  <p className='text-richblack-300'>Click Edit to change your profile picture</p>
                ) : (
                  <>
                    <p className='text-richblack-300 mb-3'>Upload a new profile picture. Recommended size: 500x500px</p>
                    <div className='flex gap-3'>
                      <label
                        htmlFor="profilePicInput"
                        className='bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 flex items-center gap-2 cursor-pointer'
                      >
                        <FaCamera />
                        Choose Picture
                      </label>
                      <button 
                        onClick={() => {
                          setProfilePic(null)
                          setPreviewImage(user?.additionalDetails?.image || '')
                        }}
                        className='bg-richblack-700 text-richblack-200 px-4 py-2 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 cursor-pointer'
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
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

        {/* Change Password Section */}
        <div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300'>
          <div className='lg:px-10 lg:py-8 p-6'>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-richblack-700 rounded-lg'>
                  <FaLock className="text-yellow-50 text-lg" />
                </div>
                <h2 className='text-xl font-semibold text-richblack-5'>Change Password</h2>
              </div>
              
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className='bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 cursor-pointer'
                >
                  <FaLock />
                  Change
                </button>
              )}
            </div>

            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div className='lg:col-span-2'>
                    <label className='text-sm text-richblack-200 mb-2 block'>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none transition-all duration-200'
                      required
                    />
                  </div>
                  
                  <div>
                    <label className='text-sm text-richblack-200 mb-2 block'>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none transition-all duration-200'
                      required
                    />
                  </div>
                  
                  <div>
                    <label className='text-sm text-richblack-200 mb-2 block'>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className='w-full bg-richblack-700 text-richblack-5 px-4 py-3 rounded-lg border border-richblack-600 focus:border-yellow-50 focus:outline-none transition-all duration-200'
                      required
                    />
                  </div>
                </div>
                
                <div className='flex gap-3 mt-6'>
                  <button
                    type="submit"
                    className='bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-all duration-200 cursor-pointer'
                  >
                    <FaSave />
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPassword(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                    className='bg-richblack-700 text-richblack-200 px-6 py-2 rounded-lg font-semibold hover:bg-richblack-600 transition-all duration-200 cursor-pointer'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className='text-richblack-300'>Keep your account secure by using a strong password</p>
            )}
          </div>
        </div>

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
        <div className='bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300'>
          <div className='lg:px-10 lg:py-8 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-red-900/50 rounded-lg'>
                <FaShieldAlt className="text-red-400 text-lg" />
              </div>
              <h2 className='text-xl font-semibold text-richblack-5'>Danger Zone</h2>
            </div>
            
            <p className='text-richblack-300 mb-4'>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <button
              onClick={handleDeleteAccount}
              className='bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-all duration-200 cursor-pointer'
            >
              <FaTrash />
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Settings