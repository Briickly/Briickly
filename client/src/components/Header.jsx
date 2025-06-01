import React, { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useState} from 'react';

export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e)=>{
     e.preventDefault();
     const urlParams = new URLSearchParams(window.location.search);
     urlParams.set('searchTerm',searchTerm);
     const searchQuery = urlParams.toString();
     navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
  }, [location.search]);
  return (
    <header className='shadow-md' >
        <div className="bg-[rgb(0,79,74)]">
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            
            <Link to='/'>
                <h1 className='font-extrabold text-2xl sm:text-3xl tracking-wide text-slate-500'>
                    Briickly
                </h1>
            </Link>

            
            <form onSubmit = {handleSubmit} className='bg-amber-50 p-3 rounded-lg flex items-center'>
                <input type="text" 
                placeholder='search...' 
                className='bg-transparent focus:outline-none w-24 sm:w-64'
                value = {searchTerm}
                onChange = {(e) => setSearchTerm(e.target.value)}
                
                />
                <button>
                <FaSearch className='text-black'/>
                </button>

            </form>
            
            <ul className='flex gap-4'>
            
                <Link to='/'>
            <li className='hidden sm:inline text-amber-400 hover:underline'>Home</li>
            </Link>
            
                <Link to='/about'>
            <li className='hidden sm:inline text-amber-400 hover:underline'>About</li>
            </Link>

            {/* <Link to='/profile'>
            {currentUser? (
                <img className = 'rounded-full h-7 w-7 object-cover' src = {currentUser.avatar} alt = 'profile'/>
            ) : (
                <li className=' text-amber-400 hover:underline'>Sign In</li>
            )
            }
            
                </Link> */}
                        {currentUser ? (
            <Link to='/profile'>
                <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
                />
            </Link>
            ) : (
            <Link to='/sign-in'>
                <li className='text-amber-400 hover:underline'>Sign In</li>
            </Link>
            )}


            </ul>


            </div>
        </div>
    </header>
  )
}
