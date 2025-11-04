import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VscSignOut } from "react-icons/vsc"
import { sidebarLinks } from '../../../data/dashboard-links'
import SideBarLink from './SideBarLink'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'
import { logout } from '../../../services/operations/authAPI'

const SideBar = () => {

const dispatch = useDispatch();
const navigate = useNavigate();

const { loading: profileLoading } = useSelector((state) => state.profile);
const { user, loading: authLoading } = useSelector((state) => state.auth);
const [confirmationModal, setConfirmationModal] = useState(null);

if (profileLoading || authLoading) {
return (
    <div className="grid h-[calc(100vh-3.5rem-1px)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
    </div>
)
}

  return (
    <>
    <div className='text-white bg-richblack-800 border-r border-r-richblack-700 min-h-[calc(100vh-3.5rem-1px)] w-[220px]'>
        <div className='flex flex-col mt-8'>
        {
            sidebarLinks.map((link) => {
                if(link.type && link.type !== user.accountType) return null;
                return (
                    <SideBarLink key={link.id} link={link} iconName={link.icon}/>
                )
            })
        }
        </div>

        <div className='h-[1px] w-10/12 bg-richblack-700 mx-auto mt-8 mb-8'></div>

        <div>
            <SideBarLink link={{name: "Settings", path: "/dashboard/settings"}} iconName={"VscSettingsGear"}/>
            <button
                className='flex gap-3 items-center justify-start px-8 py-2 text-richblack-200 font-medium text-sm cursor-pointer w-full'
                onClick={() =>
                    setConfirmationModal({
                    text1: "Are you sure?",
                    text2: "You will be logged out of your account.",
                    btn1text: "Logout",
                    btn2text: "Cancel",
                    btn1handler: () => dispatch(logout(navigate)),
                    btn2handler: () => setConfirmationModal(null)
                })}>
                <VscSignOut className='text-lg'/>
                <span>Logout</span>
            </button>
        </div>
    </div>
    {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default SideBar