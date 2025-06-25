"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Home, ArrowRight } from "lucide-react"

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })

    // Check password strength
    if (e.target.id === "password") {
      const password = e.target.value
      let strength = 0
      if (password.length >= 8) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate("/sign-in")
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Medium"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6">
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Briickly</span>
          </Link> */}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-600">Join Briickly to find your perfect property</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
                  id="username"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getPasswordStrengthColor().replace("bg-", "text-")}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Use 8+ characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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

            {/* OAuth */}
            <div className="flex justify-center w-full">
                <OAuth />
              </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-pink-600 hover:text-pink-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>


        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            By creating an account, you agree to our{" "}
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
    </div>
  )
}


// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import OAuth from '../components/OAuth';

// export default function signup() {
//   const [formData, setFormData]
//  =useState({});
//  const [error , setError]=useState(null);
//  const navigate=useNavigate();
//  const [loading, setLoading]=useState(false);
//   const handleChange=(e)=>{
//     setFormData(
//       {
//         ...formData,
//         [e.target.id]: e.target.value,
//       });
//   };

// const handleSubmit= async (e)=>{
//   e.preventDefault(); //To avoid refereshing the page when we click on submit
//   try {
      
//     setLoading(true);
//   const res = await fetch('/api/auth/signup', 
//   {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(formData),
//   });
//   const data= await res.json();

//   if(data.success ==false){
    
//     setLoading(false);
//     setError(data.message);
//     return;
//   }
//   setLoading(false);
//   setError(null);
//   navigate('/sign-in');
//   } catch (error) {
//      setLoading(false);
//      setError(error.message);
//   }
  
// };

//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
//         <input type="text" placeholder='Username' className='border p-3 rounded-lg ' id='username' onChange={handleChange}/>
//         <input type="text" placeholder='Email' className='border p-3 rounded-lg ' id='email' onChange={handleChange}/>
//         <input type="text" placeholder='Password' className='border p-3 rounded-lg ' id='password' onChange={handleChange}/>
//         <button disabled={loading } className='bg-orange-600 text-amber-50 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading? 'Loading...': 'Sign Up'}</button>
//         <OAuth/>
//       </form>

      
//     <div className='flex gap-2 mt-5'>
//       <p>Have an account?</p>
//       <Link to={"/sign-in"}>
//         <span className='text-orange-500'>Sign in</span>
//       </Link>
//     </div>

//     {error && <p className='text-red-500 mt-5'>{error}</p>}

//     </div>

//   )
// }
