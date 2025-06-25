"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Home, ArrowRight, Shield } from "lucide-react"

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6"> */}
            {/* <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Briickly</span>
          </Link> */}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
                  id="email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
                  id="password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth - Centered */}
            <div className="w-full">
              <OAuth />
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-pink-600 hover:text-pink-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-pink-600 hover:text-pink-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-pink-600 hover:text-pink-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      {/* Floating Admin Button */}
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 group bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Admin Login"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            admin?
          </span>
        </div>
      </Link>
    </div>
  )
}



// // import { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import {
// //   signInStart,
// //   signInSuccess,
// //   signInFailure,
// // } from '../redux/user/userSlice';
// // import OAuth from '../components/OAuth';

// // export default function SignIn() {
// //   const [formData, setFormData] = useState({});
// //   const { loading, error } = useSelector((state) => state.user);
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.id]: e.target.value,
// //     });
// //   };
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       dispatch(signInStart());
// //       const res = await fetch('/api/auth/signin', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(formData),
// //       });
// //       const data = await res.json();
// //       console.log(data);
// //       if (data.success === false) {
// //         dispatch(signInFailure(data.message));
// //         return;
// //       }
// //       dispatch(signInSuccess(data));
// //       navigate('/');
// //     } catch (error) {
// //       dispatch(signInFailure(error.message));
// //     }
// //   };
// //   return (
// //     <div className='p-3 max-w-lg mx-auto'>
// //       <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
// //       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
// //         <input
// //           type='email'
// //           placeholder='email'
// //           className='border p-3 rounded-lg'
// //           id='email'
// //           onChange={handleChange}
// //         />
// //         <input
// //           type='password'
// //           placeholder='password'
// //           className='border p-3 rounded-lg'
// //           id='password'
// //           onChange={handleChange}
// //         />

// //         <button
// //           disabled={loading}
// //           className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
// //         >
// //           {loading ? 'Loading...' : 'Sign In'}
// //         </button>
// //         <OAuth/>
// //       </form>
// //       <div className='flex gap-2 mt-5'>
// //         <p>Dont have an account?</p>
// //         <Link to={'/sign-up'}>
// //           <span className='text-red-700'>Sign up</span>
// //         </Link>
// //       </div>
// //       {error && <p className='text-red-500 mt-5'>{error}</p>}
// //     </div>
// //   );
// // }