"use client"
import { MdCurrencyRupee } from "react-icons/md";
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Home,
  Upload,
  X,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Car,
  Sofa,
  Tag,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })

  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true)
      setImageUploadError(false)

      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadToCloudinary(files[i]))
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          })
          setUploading(false)
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 MB max per image)")
          setUploading(false)
        })
    } else {
      setImageUploadError("You can only upload 6 images per listing")
      setUploading(false)
    }
  }

  const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      formDataUpload.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
      formDataUpload.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

      fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formDataUpload,
      })
        .then((res) => res.json())
        .then((data) => resolve(data.secure_url))
        .catch((err) => reject(err))
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  }

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      })
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      })
    }

    if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image")
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price")
      setLoading(true)
      setError(false)
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Basic Info", icon: <Home className="w-5 h-5" /> },
    { number: 2, title: "Details", icon: <Bed className="w-5 h-5" /> },
    { number: 3, title: "Images", icon: <ImageIcon className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Create a New Listing</h1>
            <p className="text-slate-600">Share your property with potential buyers or renters</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.number
                      ? "bg-pink-600 border-pink-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-pink-600" : "text-slate-400"}`}
                  >
                    Step {step.number}
                  </p>
                  <p className={`text-sm ${currentStep >= step.number ? "text-slate-800" : "text-slate-400"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-8 ${currentStep > step.number ? "bg-pink-600" : "bg-slate-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Home className="w-6 h-6 text-pink-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-800">Basic Information</h2>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Beautiful 3BR apartment in downtown"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      id="name"
                      maxLength="62"
                      minLength="10"
                      required
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      placeholder="Describe your property in detail..."
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all h-32 resize-none"
                      id="description"
                      required
                      onChange={handleChange}
                      value={formData.description}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Address *
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main Street, City, State"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      id="address"
                      required
                      onChange={handleChange}
                      value={formData.address}
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Property Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.type === "sale"
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="sale"
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.type === "sale"}
                      />
                      <Home className="w-5 h-5 mr-2" />
                      For Sale
                    </label>
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.type === "rent"
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="rent"
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.type === "rent"}
                      />
                      <Home className="w-5 h-5 mr-2" />
                      For Rent
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.parking
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="parking"
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.parking}
                      />
                      <Car className="w-5 h-5 mr-2" />
                      Parking
                    </label>
                    <label
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.furnished
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="furnished"
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.furnished}
                      />
                      <Sofa className="w-5 h-5 mr-2" />
                      Furnished
                    </label>
                    <label
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.offer
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id="offer"
                        className="sr-only"
                        onChange={handleChange}
                        checked={formData.offer}
                      />
                      <Tag className="w-5 h-5 mr-2" />
                      Special Offer
                    </label>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">Property Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-2">
                        <Bed className="w-4 h-4 inline mr-1" />
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                    </div>
                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-2">
                        <Bath className="w-4 h-4 inline mr-1" />
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="10"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">
                    <MdCurrencyRupee className="w-5 h-5 inline mr-1" />
                    Pricing
                  </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                <label htmlFor="regularPrice" className="block text-sm font-medium text-slate-700 mb-2">
                Regular Price *
                {formData.type === "rent" && <span className="text-slate-500"> (per month)</span>}
                </label>
                <div className="relative">
                      <MdCurrencyRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          id="regularPrice"
                          min="50"
                          max="10000000"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          onChange={handleChange}
                          value={formData.regularPrice}
                        />
                      </div>
                    </div>
                    {formData.offer && (
                      <div>
                        <label htmlFor="discountPrice" className="block text-sm font-medium text-slate-700 mb-2">
                          Discounted Price *
                          {formData.type === "rent" && <span className="text-slate-500"> (per month)</span>}
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            id="discountPrice"
                            min="0"
                            max="10000000"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            onChange={handleChange}
                            value={formData.discountPrice}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Property Images</h2>
                    <p className="text-sm text-slate-600">The first image will be the cover (max 6 images)</p>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="space-y-4">
                    <input
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleImageSubmit}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Images
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {imageUploadError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <span>{imageUploadError}</span>
                  </div>
                )}

                {/* Uploaded Images */}
                {formData.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-800">Uploaded Images ({formData.imageUrls.length}/6)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt="listing image"
                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    disabled={loading || uploading}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Create Listing
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
