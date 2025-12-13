import React, { useEffect, useState } from 'react'
import { PiHandPeace } from "react-icons/pi";
import { Link, NavLink } from 'react-router-dom';
import { NavbarLinks } from '../../data/navbar-links';
import { useSelector, useDispatch } from 'react-redux';
import { ACCOUNT_TYPE } from '../../utils/constant';
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import {BsChevronDown} from 'react-icons/bs';
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { fetchCourseCategories } from '../../services/operations/catalogAPI';

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

    const fetchSubLinks = async () => {
            setLoading(true);
            try{
                const response = await fetchCourseCategories();
                // console.log("categories in navbar is : " , response.data.allCategory);
                setSubLinks(response?.allCategoryDetails || []);
            }catch(error){
                console.log("Error while fetching categories", error);
            }
            setLoading(false);
            
        }

    useEffect(() => {
        fetchSubLinks();
    }, []);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        // Cleanup function to reset styles when component unmounts
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className='border-b-[1px] border-richblack-700 fixed top-0 left-0 w-full bg-richblack-900 z-50'>

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
                <nav className="hidden sm:block">
                  <ul className="text-richblack-25 text-[15px] font-inter flex items-center flex-row md:gap-8 gap-4 font-medium">
                    {NavbarLinks.map((link, index) => (
                      <li key={index}>
                        {link.title === "Catalog" ? (
                          <div
                            className="group relative flex cursor-pointer items-center gap-1.5 py-2"
                            onMouseEnter={() => setIsCatalogOpen(true)}
                            onMouseLeave={() => setIsCatalogOpen(false)}
                          >
                            <p className="relative after:absolute py-2 after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r 
                                    after:from-yellow-400 after:to-pink-500 after:transition-all after:duration-300 group-hover:after:w-full">
                              {link.title}
                            </p>
                            <BsChevronDown
                              className={`transition-transform duration-300 ${
                                isCatalogOpen ? "rotate-180" : ""
                              }`}
                            />
                            <div
                              className={`absolute left-[50%] top-full z-[1000] flex w-[220px] 
                                translate-x-[-50%] flex-col rounded-2xl bg-richblack-800/95 backdrop-blur-xl p-3
                                text-richblack-25 transition-all duration-300 lg:w-[300px] mt-4
                                border border-richblack-700/50 shadow-2xl shadow-richblack-900/50
                                ${
                                  isCatalogOpen
                                    ? "visible opacity-100 translate-y-0"
                                    : "invisible opacity-0 -translate-y-2"
                                }`}
                            >
                              <div className="absolute left-[50%] top-0 -z-10 h-4 w-4 translate-x-[-50%] translate-y-[-50%] rotate-45 rounded-sm bg-richblack-800 border-l border-t border-richblack-700/50"></div>
                              {loading ? (
                                <div className="text-center py-4">
                                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-yellow-400 border-r-transparent"></div>
                                </div>
                              ) : subLinks && subLinks.length ? (
                                <div className="space-y-1">
                                    {/* Link for all courses */}
                                    <Link
                                        to="/catalog"
                                        className="block rounded-xl bg-transparent px-4 py-3 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-pink-500/10 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-yellow-500/20"
                                      >
                                        <p className="font-medium">All Courses</p>
                                      </Link>
                                  {subLinks
                                    ?.filter((subLink) => subLink?.courses?.length >= 0)
                                    ?.map((subLink, i) => (
                                      <Link
                                        to={`/catalog/${subLink.name
                                          .split(" ")
                                          .join("-")
                                          .toLowerCase()}`}
                                        className="block rounded-xl bg-transparent px-4 py-3 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-pink-500/10 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-yellow-500/20"
                                        key={i}
                                      >
                                        <p className="font-medium">{subLink.name}</p>
                                      </Link>
                                    ))}
                                </div>
                              ) : (
                                <p className="text-center py-4 text-richblack-400">
                                  No Courses Found
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <NavLink
                            to={link?.path}
                            className={({ isActive }) =>
                              `relative transition-all duration-300 inline-block py-2 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                                isActive
                                  ? "text-yellow-400 after:w-full after:bg-gradient-to-r after:from-yellow-400 after:to-pink-500"
                                  : "hover:text-yellow-300 after:w-0 after:bg-gradient-to-r after:from-yellow-400 after:to-pink-500 hover:after:w-full"
                              }`
                            }
                          >
                            {link.title}
                          </NavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Login/signup/cart/profiledropdown */}
                <div className='flex flex-row md:gap-4 gap-2 items-center'>
                    {/* Show Login/Signup when not logged in (desktop only) */}
                    {!user && (
                        <div className='hidden lg:flex flex-row gap-6 items-center'>
                            <NavLink 
                                to="/login"
                                className={({ isActive }) =>
                                    `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 hover:scale-95
                                    ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                                }>
                                Log in
                            </NavLink>
                            <NavLink 
                                to="/signup" 
                                className={({ isActive }) =>
                                    `rounded-[8px] border border-richblack-700 px-[12px] py-[8px] transition-all duration-300 hover:scale-95
                                    ${isActive ? "bg-yellow-400 text-black" : "bg-richblack-800 text-richblack-100"}`
                                }>
                                Sign up
                            </NavLink>
                        </div>
                    )}
                    
                    {/* Show Cart & Profile when logged in */}
                    {user && (
                        <>
                            {user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                                <NavLink to="/dashboard/cart" className='relative text-2xl text-white'>
                                    <AiOutlineShoppingCart/>
                                    {totalItems > 0 && (
                                        <span className='absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                            {totalItems}
                                        </span>
                                    )}
                                </NavLink>
                            )}
                            <ProfileDropdown />
                        </>
                    )}

                    {/* Hamburger Menu Button */}
                    <button 
                        className={` text-white text-3xl ${user ? "sm:hidden": "lg:hidden"}`}
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>
                
                
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='lg:hidden fixed z-[1000] overflow-auto w-full h-full backdrop-blur-sm bg-richblack-800/80 border-t border-richblack-700'>
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