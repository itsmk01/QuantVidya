import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaVenusMars, FaBirthdayCake, FaCamera, FaChevronRight, FaClock, FaTrophy } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ColourText from '../HomePage/ColourText'

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

	const profileCompletion = Math.round((profileDetails.filter(d => !d.isEmpty).length / profileDetails.length) * 100);

	return (
		<div className='min-h-[calc(100vh-3.5rem)] bg-richblack-900'>
			{/* Hero Section with Profile Image */}
			<div className="bg-richblack-900 border-b border-richblack-800">
				<div className="w-11/12 max-w-[1260px] mx-auto py-6 lg:py-8">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-richblack-400 text-sm mb-4">
						<span>Home</span>
						<FaChevronRight className="text-xs" />
						<span>Dashboard</span>
						<FaChevronRight className="text-xs" />
						<span className="text-richblack-50">My Profile</span>
					</div>

					{/* Profile Header with Image */}
					<div className="flex flex-col md:flex-row md:items-center gap-6 mb-5">
						{/* Profile Image */}
						<div 
							className='relative group cursor-pointer flex-shrink-0'
							onMouseEnter={() => setImageHover(true)}
							onMouseLeave={() => setImageHover(false)}
							onClick={() => navigate("/dashboard/settings")}
						>
							<img 
								src={user?.additionalDetails?.image} 
								alt="Profile" 
								className='h-24 w-24 lg:h-28 lg:w-28 rounded-full object-cover border-4 border-richblack-700 
										   transition-all duration-300 group-hover:border-yellow-50' 
							/>
							<div className={`absolute inset-0 bg-black rounded-full flex items-center justify-center 
											 transition-opacity duration-300 ${imageHover ? 'opacity-70' : 'opacity-0'}`}>
								<FaCamera className="text-white text-xl" />
							</div>
							<div className='absolute -bottom-1 -right-1 bg-yellow-50 rounded-full p-2 border-4 border-richblack-900
										    group-hover:bg-yellow-100 transition-colors'>
								<FaCamera className='text-richblack-900 text-xs' />
							</div>
						</div>

						{/* User Info */}
						<div className='flex-1'>
							<h1 className="lg:text-3xl text-2xl font-bold text-white font-inter mb-2">
								{user?.firstName} <ColourText text={user?.lastName} />
							</h1>
							<p className="text-richblack-200 font-inter text-sm mb-3">
								{user?.email}
							</p>
							<div className='flex gap-2 flex-wrap'>
								<span className='px-3 py-1 bg-richblack-800 border border-richblack-700 text-yellow-50 rounded-full text-xs font-semibold'>
									{user?.accountType || 'Student'}
								</span>
								<span className='px-3 py-1 bg-richblack-800 border border-richblack-700 text-caribbeangreen-200 rounded-full text-xs font-semibold'>
									Active
								</span>
							</div>
						</div>

						{/* Edit Button */}
						<button
							onClick={() => navigate("/dashboard/settings")}
							className='bg-yellow-50 text-richblack-900 px-5 py-2.5 rounded-lg font-semibold 
									   flex items-center gap-2 hover:bg-yellow-100 transition-all duration-200 
									   hover:scale-105 shadow-md text-sm self-start md:self-center'
						>
							<FaEdit className="text-sm" />
							<span>Edit Profile</span>
						</button>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
						<div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
										hover:bg-richblack-700 transition-all duration-300">
							<div className="flex items-center gap-2 lg:gap-3">
								<div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
									<FaTrophy className="text-yellow-50 text-sm lg:text-base" />
								</div>
								<div>
									<p className="text-richblack-300 text-xs">Profile</p>
									<p className="text-white text-lg lg:text-xl font-bold">{profileCompletion}%</p>
								</div>
							</div>
						</div>

						<div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
										hover:bg-richblack-700 transition-all duration-300">
							<div className="flex items-center gap-2 lg:gap-3">
								<div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
									<FaClock className="text-caribbeangreen-200 text-sm lg:text-base" />
								</div>
								<div>
									<p className="text-richblack-300 text-xs">Member Since</p>
									<p className="text-white text-base lg:text-lg font-bold">
										{new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
									</p>
								</div>
							</div>
						</div>

						<div className="bg-richblack-800 border border-richblack-700 rounded-lg p-3 lg:p-4 
										hover:bg-richblack-700 transition-all duration-300 col-span-2 lg:col-span-1">
							<div className="flex items-center gap-2 lg:gap-3">
								<div className="p-1.5 lg:p-2 bg-richblack-700 rounded-lg">
									<FaUser className="text-blue-200 text-sm lg:text-base" />
								</div>
								<div>
									<p className="text-richblack-300 text-xs">Account Type</p>
									<p className="text-white text-lg lg:text-xl font-bold capitalize">{user?.accountType || 'Student'}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="w-11/12 max-w-[1260px] mx-auto py-8">
				{/* About Section */}
				<div className='mb-8'>
					<div className="mb-4">
						<h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
							About <ColourText text="Me" />
						</h2>
						<p className="text-richblack-300 font-inter text-sm">
							Share a bit about yourself
						</p>
					</div>

					<div className='bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
									shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
						{user?.additionalDetails?.about ? (
							<p className='text-richblack-200 leading-relaxed font-inter'>
								{user?.additionalDetails?.about}
							</p>
						) : (
							<div className="text-center py-4">
								<p className='text-richblack-400 italic mb-2'>
									No bio added yet
								</p>
								<p className='text-richblack-500 text-sm'>
									Tell the world about yourself
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Personal Details Section */}
				<div>
					<div className="mb-4">
						<h2 className="text-xl lg:text-2xl font-bold text-white font-inter mb-1">
							Personal <ColourText text="Details" />
						</h2>
						<p className="text-richblack-300 font-inter text-sm">
							Your contact information and preferences
						</p>
					</div>

					<div className='bg-richblack-800 border border-richblack-700 rounded-xl p-6 lg:p-8
									shadow-[0_0_20px_rgba(255,255,255,0.02)]'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
							{profileDetails.map((detail, index) => (
								<div 
									key={index}
									onClick={() => navigate("/dashboard/settings")}
									className='p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 
											   transition-all duration-200 cursor-pointer group'
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='flex items-start gap-3 flex-1'>
											<div className='p-2 bg-richblack-800 rounded-lg flex-shrink-0'>
												{detail.icon}
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-xs text-richblack-300 mb-1.5 font-inter'>{detail.label}</p>
												{detail.isEmpty ? (
													<p className='text-richblack-400 italic text-sm font-inter'>
														{detail.placeholder}
													</p>
												) : (
													<p className='text-richblack-5 font-medium text-sm font-inter break-words'>
														{detail.value}
													</p>
												)}
											</div>
										</div>
										<FaChevronRight className="text-richblack-400 group-hover:text-yellow-50 
																   group-hover:translate-x-1 transition-all text-xs mt-1 flex-shrink-0" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MyProfile