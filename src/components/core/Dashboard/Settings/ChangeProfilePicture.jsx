import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProfile } from '../../../../services/operations/settingsAPI'
import { FaEdit, FaCamera, FaSave } from "react-icons/fa"

const ChangeProfilePicture = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [profilePic, setProfilePic] = useState(null)
  const [previewImage, setPreviewImage] = useState(user?.additionalDetails?.image || '')

  useEffect(() => {
    if (user) {
      setPreviewImage(user.additionalDetails?.image || '')
    }
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault()
    
    if (!profilePic) {
      return
    }
    
    const formData = new FormData()
    formData.append('profilePic', profilePic)
    
    const result = await dispatch(updateProfile(formData))
    
    if (result.success) {
      setIsEditingImage(false)
      setProfilePic(null)
    }
  }

  const handleCancelImageEdit = () => {
    setIsEditingImage(false)
    setProfilePic(null)
    setPreviewImage(user?.additionalDetails?.image || '')
  }

  return (
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
  )
}

export default ChangeProfilePicture