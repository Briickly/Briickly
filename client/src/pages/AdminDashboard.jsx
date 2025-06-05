"use client"

import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    Home,
    ListFilter,
    Loader2,
    Mail,
    Plus,
    Search,
    Settings,
    Trash2,
    Users,
    XCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState("pending")
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requireApproval, setRequireApproval] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in")
      return
    }
    
    if (!currentUser.isAdmin) {
      navigate("/")
      return
    }
    
    fetchListings()
  }, [currentUser, navigate, activeTab])
  
  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let endpoint = "/api/admin/listings"
      if (activeTab === "pending") {
        endpoint += "?status=pending"
      } else if (activeTab === "approved") {
        endpoint += "?status=approved"
      } else if (activeTab === "rejected") {
        endpoint += "?status=rejected"
      }
      
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      
      const data = await res.json()
      
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      
      setListings(data.listings || [])
      setLoading(false)
    } catch (error) {
      setError("Failed to fetch listings")
      setLoading(false)
    }
  }
  
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      
      const data = await res.json()
      
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      
      setUsers(data || [])
      setLoading(false)
    } catch (error) {
      setError("Failed to fetch users")
      setLoading(false)
    }
  }
  
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === "users") {
      fetchUsers()
    } else {
      fetchListings()
    }
  }
  
  const handleApprovalToggle = async () => {
    try {
      setLoading(true)
      
      const res = await fetch("/api/admin/settings/approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ requireApproval: !requireApproval }),
      })
      
      const data = await res.json()
      
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      
      setRequireApproval(!requireApproval)
      setLoading(false)
    } catch (error) {
      setError("Failed to update approval settings")
      setLoading(false)
    }
  }
  
  const handleListingAction = async (listingId, action) => {
    try {
      setLoading(true)
      
      let endpoint = "/api/admin/listings/" + listingId
      let method = "PUT"
      let body = {}
      
      if (action === "approve" || action === "reject") {
        endpoint += "/approval"
        body = { approvalStatus: action === "approve" ? "approved" : "rejected" }
      } else if (action === "delete") {
        method = "DELETE"
      }
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: method === "DELETE" ? undefined : JSON.stringify(body),
      })
      
      const data = await res.json()
      
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        return
      }
      
      // Refresh listings after action
      fetchListings()
    } catch (error) {
      setError(`Failed to ${action} listing`)
      setLoading(false)
    }
  }
  
  const filteredListings = listings.filter(listing => 
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Briickly Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              Logged in as: <span className="font-medium">{currentUser?.username}</span>
            </span>
            <button 
              onClick={() => navigate("/profile")}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors"
            >
              Exit Admin
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => handleTabChange("pending")}
            className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "pending" ? "text-pink-600 border-b-2 border-pink-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Clock className="w-5 h-5" />
            Pending Listings
          </button>
          <button
            onClick={() => handleTabChange("approved")}
            className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "approved" ? "text-pink-600 border-b-2 border-pink-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            <CheckCircle className="w-5 h-5" />
            Approved Listings
          </button>
          <button
            onClick={() => handleTabChange("rejected")}
            className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "rejected" ? "text-pink-600 border-b-2 border-pink-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            <XCircle className="w-5 h-5" />
            Rejected Listings
          </button>
          <button
            onClick={() => handleTabChange("users")}
            className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "users" ? "text-pink-600 border-b-2 border-pink-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Users className="w-5 h-5" />
            Manage Users
          </button>
          <button
            onClick={() => handleTabChange("settings")}
            className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "settings" ? "text-pink-600 border-b-2 border-pink-600" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
        
        {/* Search Bar (for listings) */}
        {activeTab !== "users" && activeTab !== "settings" && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
          </div>
        )}
        
        {/* Content based on active tab */}
        {!loading && (
          <>
            {/* Listings Tabs */}
            {(activeTab === "pending" || activeTab === "approved" || activeTab === "rejected") && (
              <div>
                {filteredListings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <ListFilter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                      No {activeTab} listings found
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      {activeTab === "pending" 
                        ? "There are no listings waiting for approval at this time."
                        : activeTab === "approved"
                        ? "There are no approved listings yet."
                        : "There are no rejected listings."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                      <div key={listing._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Listing Image */}
                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                          {listing.imageUrls && listing.imageUrls.length > 0 ? (
                            <img 
                              src={listing.imageUrls[0]} 
                              alt={listing.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Home className="w-12 h-12 text-slate-300" />
                            </div>
                          )}
                        </div>
                        
                        {/* Listing Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-slate-800 mb-2">{listing.name}</h3>
                          <p className="text-slate-500 text-sm mb-3 line-clamp-2">{listing.description}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                            <Mail className="w-4 h-4" />
                            <span>User: {listing.userRef}</span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {activeTab === "pending" && (
                              <>
                                <button
                                  onClick={() => handleListingAction(listing._id, "approve")}
                                  className="flex-1 flex items-center justify-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleListingAction(listing._id, "reject")}
                                  className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => navigate(`/listing/${listing._id}`)}
                              className="flex-1 flex items-center justify-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleListingAction(listing._id, "delete")}
                              className="flex items-center justify-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Create New Listing Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => navigate("/create-listing")}
                    className="flex items-center gap-2 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Listing
                  </button>
                </div>
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-slate-700 font-semibold">User</th>
                        <th className="text-left py-3 px-4 text-slate-700 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-slate-700 font-semibold">Joined</th>
                        <th className="text-left py-3 px-4 text-slate-700 font-semibold">Role</th>
                        <th className="text-left py-3 px-4 text-slate-700 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-slate-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={user.avatar || "/placeholder.svg"} 
                                  alt={user.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="font-medium text-slate-800">{user.username}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{user.email}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => navigate(`/listing?userRef=${user._id}`)}
                                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                              >
                                View Listings
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Admin Settings</h2>
                
                <div className="space-y-6">
                  {/* Approval Settings */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-medium text-slate-800 mb-4">Listing Approval Settings</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 mb-1">Require approval for new listings</p>
                        <p className="text-sm text-slate-500">
                          {requireApproval 
                            ? "New listings will require admin approval before being visible"
                            : "New listings will be automatically approved and visible"}
                        </p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={requireApproval}
                          onChange={handleApprovalToggle}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}