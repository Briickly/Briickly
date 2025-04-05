import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  return (
    <header className='bg-amber-600 shadow-md' >
        <div className='flex justify-between items-center max-w-6xl mx auto p-3'>
        
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Ohio</span>
            <span className='text-amber-300'>Estate</span>
        </h1>
        </Link>
        
        <form className='bg-amber-50 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>

            <FaSearch className='text-black'/>

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

    </header>
  )
}
