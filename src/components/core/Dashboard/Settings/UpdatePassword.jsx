import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword } from '../../../../services/operations/settingsAPI'
import { FaArrowRight, FaLock, FaSave } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { getResetPasswordToken } from '../../../../services/operations/authAPI'
import ConfirmationModal from '../../../common/ConfirmationModal'

const UpdatePassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {user} = useSelector((state) => state.auth)
  
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [emailSent, setEmailSent] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    const passwordUpdated = await dispatch(changePassword(passwordData))
    console.log('Password updated')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    
    if (passwordUpdated.success) {
      setIsEditingPassword(false)
    }
  }
  const handleForgotPassword = (e) => {
    e.preventDefault() // Prevent form submission
    setConfirmationModal({
      text1: "We will send you the link at this email to reset your password ?",
      text2: user?.email,
      btn1text: "Proceed",
      btn1Icon: <FaArrowRight/>,
      btn2text: "Cancel",
      btn1handler: () => dispatch(getResetPasswordToken(user?.email, setEmailSent, navigate)),
      btn2handler: () => setConfirmationModal(null),
    })
  }

  return (
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
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="mt-1 ml-auto max-w-max text-sm text-blue-100 hover:text-blue-200 transition-colors duration-200 cursor-pointer"
                >
                  Forgot Password ?
                </button>
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
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default UpdatePassword