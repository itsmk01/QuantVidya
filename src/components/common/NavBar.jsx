import React, { useEffect } from 'react'
import { PiHandPeace } from "react-icons/pi";
import { Link, NavLink } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from '../../utils/constant';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import {BsChevronDown} from 'react-icons/bs';
import { useState } from 'react';
import ProfileDropdown from '../core/Auth/ProfileDropdown';



const NavBar = () => {

    const {user} =useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);

		const [subLinks, setSubLinks] = useState([]);
		const [loading, setLoading] = useState(false);


  return (
    <div className='border-b-[1px] border-richblack-700 '>
        <div className='w-11/12 max-w-[1260px] mx-auto h-14 flex flex-row items-center justify-between'>

            {/* QuantVidya logo */}
            <Link to="/">
                <div className='text-white flex flex-row items-center text-2xl font-bold font-inter'>
                    <span className='bg-white rounded-full text-black text-3xl flex items-center justify-center mr-[2px] px-1.5 h-8'>
                        Q
                    </span>uant<PiHandPeace/>idya
                </div>
            </Link>

            {/* Navigation Link */}
            <nav>
                <ul className='text-richblack-25 text-base font-inter flex items-center flex-row gap-6'>
                {
                    NavbarLinks.map((link, index) => (
                        <li key={index}>
                            {
                                link.title === "Catalog" ? 
                                (
                                <>
                                    <div
                                    className={`group relative flex cursor-pointer items-center gap-1 `}
                                    >
                                    <p>{link.title}</p>
                                    <BsChevronDown />
                                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] 
                                                    translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 
                                                    text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] 
                                                        translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                        {loading ? (
                                        <p className="text-center">Loading...</p>
                                        ) : (subLinks && subLinks.length) ? (
                                        <>
                                            {subLinks
                                            ?.filter(
                                                (subLink) => subLink?.courses?.length > 0
                                            )
                                            ?.map((subLink, i) => (
                                                <Link
                                                to={`/catalog/${subLink.name
                                                    .split(" ")
                                                    .join("-")
                                                    .toLowerCase()}`}
                                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                key={i}
                                                >
                                                <p>{subLink.name}</p>
                                                </Link>
                                            ))}
                                        </>
                                        ) : (
                                        <p className="text-center">No Courses Found</p>
                                        )}
                                    </div>
                                    </div>
                                </>
                                )
                                :(
                                    <NavLink
                                    to={link?.path}
                                    className={({ isActive }) =>
                                        `transition-transform duration-300 inline-block ${
                                        isActive ? "text-yellow-500 text-xl font-semibold" : "hover:scale-105"
                                        }`
                                    }
                                    >
                                    {link.title}
                                    </NavLink>

                                )
                            }
                        </li>
                    ))
                }
                </ul>
            </nav>

            {/* Login/SignUp/Dashboard/Cart */}
            <div className='text-white flex flex-row gap-6'>
                {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <NavLink to="/dashboard/cart" className='relative'>
                        <AiOutlineShoppingCart/>
                        {
                            totalItems > 0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </NavLink>
                )}
                {!user && (
                    <NavLink 
                    to="/login"
                    className={({ isActive }) =>
                        `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 hover:scale-95
                        ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                    }>
                        Log in
                    </NavLink>
                )}
                {!user && (
                    <NavLink 
                    to="/signup" 
                    className={({ isActive }) =>
                        `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 hover:scale-95
                        ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                    }>
                        Sign up
                    </NavLink>
                )}
                {user && <ProfileDropdown />}
            </div>
        </div>
    </div>
  )
}

export default NavBar