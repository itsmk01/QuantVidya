import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResetPasswordToken } from '../services/operations/authAPI';
import { FaArrowCircleLeft } from "react-icons/fa";
import BackButton from '../components/common/BackButton';

const ForgotPassword = () => {

    const {loading} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    

    const handleOnChange = (e) => {
        // Since 'email' is a string, directly set the value
        setEmail(e.target.value);
    }

    const handleResetPassword = (e) => {
        e.preventDefault();
        dispatch(getResetPasswordToken(email, setEmailSent, navigate));
    }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-3.5rem)]'>
        <div className='max-w-[500px] flex flex-col gap-4 p-4 lg:p-8'>
        {!emailSent ?
            <div>
                <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
                    Reset Your Password
                </h1>
                <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
                    Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email 
                    we can try account recovery
                </p>
                <form onSubmit={handleResetPassword}>
                    <label className="w-full">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                        required
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter email address"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>

                    <button
                        type='submit'
                        className='w-full bg-yellow-100 hover:bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium 
                                text-richblack-900 cursor-pointer transition-all duration-300'
                        disabled={loading}  // Disable button while loading
                    >
                        {loading? "Sending...": "Reset Password"}
                    </button>
                    {/* Back button */}
                    <BackButton to="/login" label="Back to login"/>
                </form>
            </div>:
            <div className='ml-24'>
                <h1 className='text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]'>
                    Check Your Email
                </h1>
                <p className='text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100'>
                   We have sent the reset email to {email}.
                </p>
                {/* Back button */}
                <BackButton to="/login" label="Back to login"/>
            </div>} 
        </div>
    </div>
  )
}

export default ForgotPassword