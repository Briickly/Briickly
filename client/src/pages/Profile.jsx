"use client"

import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from "../redux/user/userSlice"
import { useNavigate, Link } from "react-router-dom"
import {
  User,
  Camera,
  LogOut,
  Trash2,
  Plus,
  Home,
  Edit3,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Clock,
  XCircle,
  X,
} from "lucide-react"

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
    password: "",
  })
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const [showListings, setShowListings] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [listingFilter, setListingFilter] = useState("all")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in", { replace: true })
    }
  }, [currentUser, navigate])

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
    // eslint-disable-next-line
  }, [file])

  // Secure Cloudinary upload using Vite env variables
  const handleFileUpload = async (file) => {
    setIsUploadingAvatar(true)
    setFilePerc(0)
    setFileUploadError(false)
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    )
    formDataUpload.append(
      "cloud_name",
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    )

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      )
      const data = await res.json()
      if (data.secure_url) {
        const newFormData = { ...formData, avatar: data.secure_url }
        setFormData(newFormData)
        setFilePerc(100)
        setFileUploadError(false)
        await updateProfileWithAvatar(data.secure_url)
      } else {
        throw new Error(data.error?.message || "Image upload failed")
      }
    } catch (error) {
      setFileUploadError(true)
      setFilePerc(0)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const updateProfileWithAvatar = async (avatarUrl) => {
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
        }),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true)
      setFilePerc(0)
      setFileUploadError(false)
      const newFormData = { ...formData, avatar: "" }
      setFormData(newFormData)
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newFormData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser || !currentUser._id) {
      dispatch(updateUserFailure("User not authenticated"))
      return
    }
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    if (!currentUser || !currentUser._id) {
      dispatch(deleteUserFailure("User not authenticated"))
      navigate("/sign-in", { replace: true })
      return
    }
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${text}`)
      }
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json()
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message))
          return
        }
      }
      dispatch(deleteUserSuccess())
      navigate("/sign-in", { replace: true })
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
      navigate("/sign-in", { replace: true })
    }
  }

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
      navigate("/sign-in", { replace: true })
    } catch (error) {
      dispatch(signOut())
      navigate("/sign-in", { replace: true })
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingsError(true)
        return
      }
      setUserListings(data)
      setShowListings(true)
      setActiveTab("listings")
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success === false) {
        return
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {}
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const filteredListings = userListings.filter((listing) => {
    if (listingFilter === "all") return true
    return listing.approvalStatus === listingFilter
  })

  const getFilterCount = (status) => {
    if (status === "all") return userListings.length
    return userListings.filter((listing) => listing.approvalStatus === status).length
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 hover:border-white/50 transition-all">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar || "/placeholder.svg"}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-14 w-14 text-white/70" />
                  )}
                </div>
                {/* Camera Icon - Functional */}
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 transition-colors"
                  disabled={isUploadingAvatar}
                  title="Change profile picture"
                >
                  <Camera className="h-4 w-4 text-pink-600" />
                </button>
                {/* Remove Avatar Button */}
                {formData.avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                    disabled={isUploadingAvatar}
                    title="Remove profile picture"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                )}
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{currentUser?.username || "User"}</h1>
                <p className="text-pink-100">{currentUser?.email}</p>
                {fileUploadError ? (
                  <div className="flex items-center gap-2 mt-2 bg-red-500/20 text-white px-3 py-1 rounded-full text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Upload failed (image must be less than 10MB)</span>
                  </div>
                ) : isUploadingAvatar ? (
                  <div className="flex items-center gap-2 mt-2 bg-pink-500/20 text-white px-3 py-1 rounded-full text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating profile...</span>
                  </div>
                ) : filePerc === 100 ? (
                  <div className="flex items-center gap-2 mt-2 bg-green-500/20 text-white px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Profile picture updated!</span>
                  </div>
                ) : null}
              </div>
              <div className="md:ml-auto flex gap-3">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
                <Link
                  to="/create-listing"
                  className="flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Create Listing
                </Link>
              </div>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-pink-600 text-pink-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  handleShowListings()
                  setActiveTab("listings")
                }}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "listings"
                    ? "border-pink-600 text-pink-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Home className="h-4 w-4" />
                My Listings
                {userListings.length > 0 && (
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                    {userListings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "security"
                    ? "border-pink-600 text-pink-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Shield className="h-4 w-4" />
                Security
              </button>
            </div>
          </div>
          {/* Content Area */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-slate-800">Profile Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Password (leave empty to keep current)"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      disabled={loading}
                      type="submit"
                      className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "listings" && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-semibold text-slate-800">My Listings</h2>
                  <Link
                    to="/create-listing"
                    className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Listing
                  </Link>
                </div>
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                  {[
                    { key: "all", label: "All Listings" },
                    { key: "approved", label: "Approved" },
                    { key: "pending", label: "Pending" },
                    { key: "rejected", label: "Rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setListingFilter(filter.key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        listingFilter === filter.key
                          ? "bg-white text-pink-600 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {filter.key !== "all" && getStatusIcon(filter.key)}
                      {filter.label}
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                        {getFilterCount(filter.key)}
                      </span>
                    </button>
                  ))}
                </div>
                {showListingsError ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <span>Error loading listings. Please try again.</span>
                  </div>
                ) : filteredListings && filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex">
                          <Link to={`/listing/${listing._id}`} className="w-1/3">
                            <img
                              src={listing.imageUrls[0] || "/placeholder.svg"}
                              alt="listing cover"
                              className="h-full w-full object-cover"
                            />
                          </Link>
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                              <Link
                                className="text-slate-800 font-semibold text-lg hover:text-pink-600 transition-colors line-clamp-1 flex-1"
                                to={`/listing/${listing._id}`}
                              >
                                {listing.name}
                              </Link>
                            </div>
                            {/* Enhanced Status Badge */}
                            <div className="mb-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(
                                  listing.approvalStatus || "pending",
                                )}`}
                              >
                                {getStatusIcon(listing.approvalStatus || "pending")}
                                {listing.approvalStatus === "approved" && "Approved"}
                                {listing.approvalStatus === "rejected" && "Rejected"}
                                {(!listing.approvalStatus || listing.approvalStatus === "pending") &&
                                  "Pending Approval"}
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm mb-3 line-clamp-2">{listing.description}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-pink-600 font-semibold">
                                ${listing.regularPrice.toLocaleString()}
                                {listing.type === "rent" && " / month"}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleListingDelete(listing._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete listing"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <Link
                                  to={`/update-listing/${listing._id}`}
                                  className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                  title="Edit listing"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <Home className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-700 mb-2">
                      {listingFilter === "all" ? "No listings yet" : `No ${listingFilter} listings`}
                    </h3>
                    <p className="text-slate-500 mb-6">
                      {listingFilter === "all"
                        ? "Create your first property listing to get started"
                        : `You don't have any ${listingFilter} listings at the moment`}
                    </p>
                    {listingFilter === "all" && (
                      <Link
                        to="/create-listing"
                        className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Listing
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === "security" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-slate-800">Account Security</h2>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Danger Zone</h3>
                    <p className="text-slate-600 mb-6">
                      Permanently delete your account and all of your content. This action cannot be undone.
                    </p>
                    {showDeleteConfirm ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <h4 className="text-red-700 font-medium mb-2">Are you absolutely sure?</h4>
                        <p className="text-red-600 text-sm mb-4">
                          This will permanently delete your account, all your listings, and personal data. This action
                          cannot be undone.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteUser}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Yes, delete my account
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
