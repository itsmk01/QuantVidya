import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaBirthdayCake, FaCamera, FaChevronRight } from "react-icons/fa";
import { getUserDetails } from '../../../services/operations/userAPI';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {

	const navigate = useNavigate();
	const {user, loading: authLoading} = useSelector((state) => state.auth);
	const {loading: profileLoading} = useSelector((state) => state.profile);
	const [imageHover, setImageHover] = useState(false);
	

	if (profileLoading || authLoading) {
		return (
			<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
				<div className="flex flex-col items-center gap-4">
					<div className="spinner"></div>
					<p className="text-richblack-200 animate-pulse">Loading your profile...</p>
				</div>
			</div>
		)
	}

	const profileDetails = [
		{
			icon: <FaUser className="text-yellow-50" />,
			label: "First Name",
			value: user?.firstName,
			isEmpty: false
		},
		{
			icon: <FaUser className="text-yellow-50" />,
			label: "Last Name",
			value: user?.lastName,
			isEmpty: false
		},
		{
			icon: <FaEnvelope className="text-yellow-50" />,
			label: "Email",
			value: user?.email,
			isEmpty: false
		},
		{
			icon: <FaPhone className="text-yellow-50" />,
			label: "Phone Number",
			value: user?.additionalDetails?.contactNumber,
			placeholder: "Add Contact Number",
			isEmpty: !user?.additionalDetails?.contactNumber
		},
		{
			icon: <FaVenusMars className="text-yellow-50" />,
			label: "Gender",
			value: user?.additionalDetails?.gender,
			placeholder: "Add Gender",
			isEmpty: !user?.additionalDetails?.gender
		},
		{
			icon: <FaBirthdayCake className="text-yellow-50" />,
			label: "Date of Birth",
			value: user?.additionalDetails?.dateOfBirth,
			placeholder: "Add Date of Birth",
			isEmpty: !user?.additionalDetails?.dateOfBirth
		}
	];

	return (
		<div className='min-h-[calc(100vh-3.5rem)] bg-richblack-900 pb-12'>
			{/* Hero Section with Cover */}
			<div className="relative w-full h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
				<div className="absolute inset-0 bg-black opacity-20"></div>
			</div>

			<div className='w-11/12 max-w-[1000px] mx-auto -mt-16 relative z-10'>
				{/* Profile Header Card */}
				<div className='bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl'>
					<div className='lg:px-10 lg:py-8 p-6'>
						<div className='flex md:flex-row flex-col md:items-center gap-6'>
							{/* Profile Image with Upload Hint */}
							<div 
								className='relative group cursor-pointer'
								onMouseEnter={() => setImageHover(true)}
								onMouseLeave={() => setImageHover(false)}
							>
								<img 
									src={user?.additionalDetails?.image} 
									alt="Profile" 
									className='md:h-28 md:w-28 w-20 h-20 rounded-full object-cover border-4 border-richblack-700 transition-all duration-300 group-hover:border-yellow-50' 
								/>
								<div className={`absolute inset-0 bg-black rounded-full flex items-center justify-center transition-opacity duration-300 ${imageHover ? 'opacity-70' : 'opacity-0'}`}>
									<FaCamera className="text-white text-2xl" />
								</div>
								<div className='absolute -bottom-1 -right-1 bg-yellow-50 rounded-full p-2 border-4 border-richblack-800'>
									<FaCamera className='text-richblack-900 text-xs' />
								</div>
							</div>

							{/* User Info */}
							<div className='flex-1'>
								<h1 className='lg:text-3xl text-2xl font-bold text-richblack-5 mb-2'>
									{user?.firstName} {user?.lastName}
								</h1>
								<p className='text-richblack-300 flex items-center gap-2 mb-3'>
									<FaEnvelope className="text-sm" />
									{user?.email}
								</p>
								<div className='flex gap-2 flex-wrap'>
									<span className='px-3 py-1 bg-richblack-700 text-yellow-50 rounded-full text-sm font-medium'>
										{user?.accountType || 'Student'}
									</span>
									<span className='px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm font-medium'>
										Active
									</span>
								</div>
							</div>

							{/* Edit Button */}
							<button
								onClick={() => navigate("/dashboard/settings")}
								className='bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold flex items-center 
											cursor-pointer gap-2 hover:bg-yellow-100 transition-all duration-200 hover:scale-105 shadow-lg'
							>
								<FaEdit />
								<span>Edit Profile</span>
							</button>
						</div>
					</div>
				</div>

				{/* About Section */}
				<div className='mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300'>
					<div className='lg:px-10 lg:py-8 p-6'>
						<div className='flex justify-between items-start gap-4'>
							<div className='flex-1'>
								<div className='flex items-center gap-3 mb-4'>
									<div className='p-2 bg-richblack-700 rounded-lg'>
										<FaUser className="text-yellow-50 text-lg" />
									</div>
									<h2 className='text-xl font-semibold text-richblack-5'>About</h2>
								</div>
								<p className='text-richblack-300 leading-relaxed'>
									{user?.additionalDetails?.about || (
										<span className='italic text-richblack-400'>
											Tell the world about yourself... What makes you unique?
										</span>
									)}
								</p>
							</div>
							<button
								onClick={() => navigate("/dashboard/settings")}
								className='text-yellow-50 hover:text-yellow-100 transition-colors p-2 hover:bg-richblack-700 
											rounded-lg cursor-pointer'
							>
								<FaEdit className="text-xl" />
							</button>
						</div>
					</div>
				</div>

				{/* Personal Details Section */}
				<div className='mt-6 bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300'>
					<div className='lg:px-10 lg:py-8 p-6'>
						<div className='flex justify-between items-start mb-6'>
							<h2 className='text-xl font-semibold text-richblack-5'>Personal Details</h2>
							<button
								onClick={() => navigate("/dashboard/settings")}
								className='bg-richblack-700 text-yellow-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 
								         cursor-pointer hover:bg-richblack-600 transition-all duration-200'
							>
								<FaEdit />
								<span>Edit</span>
							</button>
						</div>

						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{profileDetails.map((detail, index) => (
								<div 
									key={index}
									className='p-4 overflow-auto bg-richblack-700 rounded-lg hover:bg-richblack-600 transition-all duration-200 cursor-pointer group'
								>
									<div className='flex items-start gap-3'>
										<div className='p-2 bg-richblack-800 rounded-lg group-hover:bg-richblack-900 transition-colors'>
											{detail.icon}
										</div>
										<div className='flex-1'>
											<p className='text-sm text-richblack-300 mb-1'>{detail.label}</p>
											{detail.isEmpty ? (
												<p className='text-richblack-400 italic text-sm flex items-center gap-2'>
													{detail.placeholder}
													<FaChevronRight className="text-xs" />
												</p>
											) : (
												<p className='text-richblack-5 font-medium'>{detail.value}</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Quick Stats or Additional Info (Optional Enhancement) */}
				<div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700 shadow-lg'>
						<p className='text-blue-200 text-sm mb-1'>Member Since</p>
						<p className='text-white text-xl font-bold'>
							{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
						</p>
					</div>
					<div className='bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700 shadow-lg'>
						<p className='text-purple-200 text-sm mb-1'>Profile Completion</p>
						<p className='text-white text-xl font-bold'>
							{Math.round((profileDetails.filter(d => !d.isEmpty).length / profileDetails.length) * 100)}%
						</p>
					</div>
					<div className='bg-gradient-to-br from-pink-900 to-pink-800 p-6 rounded-xl border border-pink-700 shadow-lg'>
						<p className='text-pink-200 text-sm mb-1'>Account Type</p>
						<p className='text-white text-xl font-bold capitalize'>
							{user?.accountType || 'Student'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MyProfile