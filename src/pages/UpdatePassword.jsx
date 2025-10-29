import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI"; // your function
import { useDispatch, useSelector } from "react-redux";
import { FaArrowCircleLeft } from "react-icons/fa";
import BackButton from "../components/common/BackButton";

const UpdatePassword = () => {

    const {loading} = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [resetPasswordFormData, setResetPasswordFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleOnChange = (e) => {
        setResetPasswordFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }

    const {password, confirmPassword} = resetPasswordFormData;

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(resetPassword(password, confirmPassword, token, navigate))
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] max-w-[500px]  
                        gap-4 p-4 lg:p-8 place-self-center">
            <h2 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Reset Your Password</h2>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        New Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handleOnChange}
                        placeholder="Enter Password"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                        {showPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                        </span>
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder="Confirm Password"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                        {showConfirmPassword ? (
                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                        </span>
                    </label>
                </div>
                <button
                type="submit"
                className="bg-yellow-100 hover:bg-yellow-50 text-black py-2 rounded cursor-pointer transition-all duration-300"
                disabled={loading}
                >
                {loading? "Please wait...": "Reset Password"}
                </button>
            </form>
            {/* Back button */}
            <BackButton to="/login" label="Back to Login"/>
        </div>
    );
};

export default UpdatePassword;
