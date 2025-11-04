import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SideBar from '../components/core/Dashboard/SideBar'

const Dashboard = () => {

const { loading: profileLoading } = useSelector((state) => state.profile)
const { loading: authLoading } = useSelector((state) => state.auth)

if (profileLoading || authLoading) {
return (
	<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
		<div className="spinner"></div>
	</div>
)
}

  return (
    <div className='flex min-h-[calc(100vh-3.5rem-1px)]'>
		<SideBar/>
		<div>
			<Outlet/>
		</div>
    </div>
  )
}

export default Dashboard