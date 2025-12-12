import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../../../../services/operations/settingsAPI'
import { FaTrash, FaShieldAlt } from "react-icons/fa"
import ConfirmationModal from '../../../common/ConfirmationModal'
import toast from 'react-hot-toast'

const DeleteAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteAccount = () => {
    let passwordInput = ""
    
    setConfirmationModal({
      text1: "Are you sure?",
      text2: (
        <div className="flex flex-col gap-3">
          <p>Your account will be deleted permanently.</p>
          <input
            type="password"
            placeholder="Enter your password to confirm"
            onChange={(e) => { passwordInput = e.target.value }}
            className="w-full rounded-md bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400"
          />
        </div>
      ),
      btn1text: "Delete Account",
      btn1Icon: <FaTrash />,
      btn2text: "Cancel",
      btn1handler: () => {
        if (!passwordInput || passwordInput.trim() === "") {
          toast.error("Please enter your password")
          return
        }
        dispatch(deleteAccount(passwordInput, navigate))
        setConfirmationModal(null)
      },
      btn2handler: () => {
        setConfirmationModal(null)
      },
      variant: "red",
    })
  }

  return (
    <>
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
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default DeleteAccount