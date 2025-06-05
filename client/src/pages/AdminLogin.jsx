"use client"

import { AlertCircle, ArrowRight, Eye, EyeOff, Home, Key, Loader2, Lock, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice"

export default function AdminLogin() {
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showPasscode, setShowPasscode] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Hidden click counter for secret admin access
  const [secretClickCount, setSecretClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  // Handle the hidden area click
  const handleSecretClick = () => {
    const currentTime = new Date().getTime()
    
    // Reset counter if more than 2 seconds between clicks
    if (currentTime - lastClickTime > 2000) {
      setSecretClickCount(1)
    } else {
      setSecretClickCount(secretClickCount + 1)
    }
    
    setLastClickTime(currentTime)
  }

  // Show admin form when secret area is clicked 3 times
  useEffect(() => {
    if (secretClickCount >= 3) {
      setShowAdminForm(true)
    }
  }, [secretClickCount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())

      // Make sure we have all required fields
      if (!formData.email || !formData.password || !formData.adminPasscode) {
        dispatch(signInFailure("All fields are required for admin login"))
        return
      }

      const res = await fetch("/api/admin/login", {
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
      navigate("/admin/dashboard")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      {/* Hidden clickable area in top right corner */}
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 bg-red-200 z-50 cursor-default" 
        onClick={handleSecretClick}
        aria-hidden="true"
      />

      {showAdminForm ? (
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6">
              <Home className="w-6 h-6" />
              <span className="text-xl font-bold">Briickly Admin</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-slate-600 mt-2">Enter your credentials to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@briickly.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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

            {/* Admin Passcode Field */}
            <div>
              <label htmlFor="adminPasscode" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Passcode
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter admin passcode"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  id="adminPasscode"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  Access Admin Panel
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back to regular login */}
          <div className="mt-8 text-center">
            <Link to="/sign-in" className="text-slate-600 hover:text-pink-600 transition-colors">
              Return to regular login
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6">
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Briickly</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-slate-600 mt-2 mb-6">The page you are looking for doesn't exist or has been moved.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      )}
    </div>
  )
}