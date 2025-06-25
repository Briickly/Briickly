"use client"

import { ChevronDown, Home, Info, LogOut, Menu, PlusCircle, Search, Settings, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signOut } from "../redux/user/userSlice"

export default function Header() {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false)
      setIsMenuOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const navLinks = [
    { to: "/", label: "Home", icon: <Home className="w-4 h-4 text-pink-300" /> },
    { to: "/about", label: "About", icon: <Info className="w-4 h-4 text-pink-300" /> },
  ]

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error(`Sign out failed: ${res.status}`)
      }
      dispatch(signOut())
      navigate("/", { replace: true })
    } catch (error) {
      console.error("Sign out failed:", error)
      dispatch(signOut())
      navigate("/", { replace: true })
    }
  }

  return (
    <header className="bg-gradient-to-r from-pink-600 to-indigo-700 text-pink-100 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <h1 className="font-bold text-3xl text-black-800 group-hover:text-blue-600 transition-colors">Briickly</h1>
          </Link>

          <form onSubmit={handleSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, locations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 hover:bg-white placeholder:text-slate-400 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-1.5 rounded-md hover:bg-pink-700 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-black-500 hover:text-pink-500 font-medium transition-colors"
              >
                <span className="text-white">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileOpen(!isProfileOpen)
                  }}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-pink-500 transition-colors"
                >
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt="Profile"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-slate-800">{currentUser.username}</p>
                      <p className="text-sm text-slate-500">{currentUser.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/create-listing"
                        className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <PlusCircle className="w-4 h-4" />
                        Create Listing
                      </Link>
                      {currentUser.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/sign-in" className="text-black hover:text-white font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 hover:text-gray-900 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="md:hidden pb-4">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-slate-50 placeholder:text-slate-400 text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 text-white p-1.5 rounded-md hover:bg-pink-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {currentUser ? (
                <>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt="Profile"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{currentUser.username}</p>
                        <p className="text-sm text-slate-500">{currentUser.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/create-listing"
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Create Listing
                    </Link>
                    {currentUser.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                  <Link
                    to="/sign-in"
                    className="block px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}


// import React, { useEffect } from 'react'
// import { FaSearch } from 'react-icons/fa';
// import { Link, Navigate, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {useState} from 'react';

// export default function Header() {
//   const {currentUser} = useSelector(state=>state.user)
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
//   const handleSubmit = (e)=>{
//      e.preventDefault();
//      const urlParams = new URLSearchParams(window.location.search);
//      urlParams.set('searchTerm',searchTerm);
//      const searchQuery = urlParams.toString();
//      navigate(`/search?${searchQuery}`);
//   };

//   useEffect(()=>{
//         const urlParams = new URLSearchParams(location.search);
//         const searchTermFromUrl = urlParams.get('searchTerm');
//         if(searchTermFromUrl){
//             setSearchTerm(searchTermFromUrl);
//         }
//   }, [location.search]);
//   return (
//     <header className='shadow-md bg-gradient-to-r from-pink-600 to-indigo-700 text-pink' >
//         {/* <div className="bg-[rgb(45, 151, 107)]"> */}
//             <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            
//             <Link to='/'>
//                 <h1 className='font-extrabold text-2xl sm:text-3xl tracking-wide text-pink-100'>
//                     Briickly
//                 </h1>
//             </Link>

            
//             <form onSubmit = {handleSubmit} className='bg-amber-50 p-3 rounded-lg flex items-center'>
//                 <input type="text" 
//                 placeholder='search...' 
//                 className='bg-transparent focus:outline-none w-24 sm:w-64'
//                 value = {searchTerm}
//                 onChange = {(e) => setSearchTerm(e.target.value)}
                
//                 />
//                 <button>
//                 <FaSearch className='text-black'/>
//                 </button>

//             </form>
            
//             <ul className='flex gap-4'>
            
//                 <Link to='/'>
//             <li className='font-bold hidden sm:inline text-pink-100 hover:underline'>Home</li>
//             </Link>
            
//                 <Link to='/about'>
//             <li className='hidden sm:inline text-pink-100 hover:underline'>About</li>
//             </Link>

//             {/* <Link to='/profile'>
//             {currentUser? (
//                 <img className = 'rounded-full h-7 w-7 object-cover' src = {currentUser.avatar} alt = 'profile'/>
//             ) : (
//                 <li className=' text-amber-400 hover:underline'>Sign In</li>
//             )
//             }
            
//                 </Link> */}
//                         {currentUser ? (
//             <Link to='/profile'>
//                 <img
//                 className='rounded-full h-7 w-7 object-cover'
//                 src={currentUser.avatar}
//                 alt='profile'
//                 />
//             </Link>
//             ) : (
//             <Link to='/sign-in'>
//                 <li className='text-amber-400 hover:underline'>Sign In</li>
//             </Link>
//             )}


//             </ul>


//             </div>
//         {/* </div> */}
//     </header>
//   )
// }
