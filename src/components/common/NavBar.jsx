import React, { useEffect, useState } from 'react'
import { PiHandPeace } from "react-icons/pi";
import { Link, NavLink } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector, useDispatch } from 'react-redux';
import { ACCOUNT_TYPE } from '../../utils/constant';
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import {BsChevronDown} from 'react-icons/bs';
import ProfileDropdown from '../core/Auth/ProfileDropdown';

const NavBar = () => {
    const {user} = useSelector((state) => state.auth);
    const {totalItems} = useSelector((state) => state.cart);

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className='border-b-[1px] border-richblack-700 '>

            {/* Desktop Menu */}
            <div className='w-11/12 max-w-[1260px] mx-auto h-14 flex flex-row items-center justify-between'>

                {/* QuantVidya logo */}
                <Link to="/">
                    <div className='text-white flex flex-row items-center text-2xl font-bold font-inter'>
                        <span className='bg-white rounded-full text-black text-3xl flex items-center justify-center mr-[2px] px-1.5 h-8'>
                            Q
                        </span>uant<PiHandPeace/>idya
                    </div>
                </Link>

                {/* Navigation Link - Hidden on small screens only */}
                <nav className='hidden sm:block'>
                    <ul className='text-richblack-25 text-base font-inter flex items-center flex-row gap-6 font-bold'>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                    link.title === "Catalog" ? 
                                    (
                                    <>
                                        <div
                                        className={`group relative flex cursor-pointer items-center gap-1 `}
                                        onMouseEnter={() => setIsCatalogOpen(true)}
                                        onMouseLeave={() => setIsCatalogOpen(false)}
                                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                                        >
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        <div className={`absolute left-[50%] top-[-50%] z-[1000] flex w-[200px] 
                                                        translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 
                                                        text-richblack-900 transition-all duration-150 lg:w-[300px]
                                                        ${isCatalogOpen ? 'visible opacity-100 translate-y-[1.65em]' : 'invisible opacity-0'}`}>
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] 
                                                            translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">
                                            </div>
                                            {loading ? 
                                            (
                                                <p className="text-center">Loading...</p>
                                            ) : 
                                            (
                                                (subLinks && subLinks.length) ? 
                                                (
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
                                                ) : 
                                                (
                                                    <p className="text-center">No Courses Found</p>
                                                )
                                            )}
                                        </div>
                                        </div>
                                    </>
                                    )
                                    :(
                                        <NavLink
                                        to={link?.path}
                                        className={({ isActive }) =>
                                            `transition-all duration-300 inline-block ${
                                            isActive && "text-yellow-500" 
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

                {/* Desktop Login/SignUp - Hidden on medium and small screens */}
                <div className='hidden lg:flex text-white flex-row gap-6 items-center'>
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
                </div>
                
                {/* Profile Dropdown & Cart */}
                <div className='flex flex-row gap-4 items-center'>
                    {/* Dashboard/Cart */}
                    <div className='flex text-white flex-row gap-6 items-center'>
                        {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                            <NavLink to="/dashboard/cart" className='relative text-2xl'>
                                <AiOutlineShoppingCart/>
                                {
                                    totalItems > 0 && (
                                        <span className='absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </NavLink>
                        )}
                        {user && <ProfileDropdown />}
                    </div>

                    {/* Hamburger Menu Button - Show on medium and small screens */}
                    <button 
                        className='lg:hidden text-white text-3xl'
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='lg:hidden bg-richblack-800 border-t border-richblack-700'>
                    <div className='w-11/12 mx-auto py-4'>
                        {/* Navigation Links - Show on small screens only */}
                        <nav className='sm:hidden mb-4'>
                            <ul className='text-richblack-25 text-base font-inter flex flex-col gap-4 font-bold'>
                            {
                                NavbarLinks.map((link, index) => (
                                    <li key={index}>
                                        {
                                            link.title === "Catalog" ? 
                                            (
                                            <>
                                                <div className='flex flex-col'>
                                                    <div className='flex items-center gap-1 cursor-pointer'
                                                         onClick={() => setIsCatalogOpen(!isCatalogOpen)}>
                                                        <p>{link.title}</p>
                                                        <BsChevronDown className={`transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
                                                    </div>
                                                    {isCatalogOpen && (
                                                        loading ? 
                                                        (
                                                            <p className="ml-4 mt-2 text-sm">Loading...</p>
                                                        ) : 
                                                        (
                                                            (subLinks && subLinks.length) ? 
                                                            (
                                                                <div className='ml-4 mt-2 flex flex-col gap-2'>
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
                                                                        className="text-sm py-2 hover:text-yellow-500"
                                                                        key={i}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        >
                                                                        {subLink.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            ) : 
                                                            (
                                                                <p className="ml-4 mt-2 text-sm">No Courses Found</p>
                                                            )
                                                        )
                                                    )}
                                                </div>
                                            </>
                                            )
                                            :(
                                                <NavLink
                                                to={link?.path}
                                                className={({ isActive }) =>
                                                    `transition-all duration-300 inline-block ${
                                                    isActive && "text-yellow-500" 
                                                    }`
                                                }
                                                onClick={() => setIsMobileMenuOpen(false)}
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

                        {/* Mobile Login/Signup - Show on medium and small screens */}
                        <div className='flex flex-col gap-4 text-white border-t border-richblack-700 pt-4'>
                            {!user && (
                                <NavLink 
                                to="/login"
                                className={({ isActive }) =>
                                    `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 text-center
                                    ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log in
                                </NavLink>
                            )}
                            {!user && (
                                <NavLink 
                                to="/signup" 
                                className={({ isActive }) =>
                                    `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 text-center
                                    ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign up
                                </NavLink>
                            )}
                            
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NavBar