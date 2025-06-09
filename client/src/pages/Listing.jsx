"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { useSelector } from "react-redux"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css/bundle"
import {
  Bath,
  Bed,
  Car,
  Sofa,
  MapPin,
  Share2,
  Heart,
  Home,
  Calendar,
  Mail,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react"
import Contact from "../components/Contact"

export default function Listing() {
  SwiperCore.use([Navigation, Pagination])
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()
        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }
        setListing(data)
        setLoading(false)
        setError(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.listingId])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleSave = () => {
    setSaved(!saved)
    // Here you would typically save to backend
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-slate-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Something went wrong!</h2>
          <p className="text-slate-600">We couldn't load this property. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!listing) return null

  const features = [
    {
      icon: <Bed className="w-5 h-5" />,
      label: listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`,
      value: listing.bedrooms,
    },
    {
      icon: <Bath className="w-5 h-5" />,
      label: listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`,
      value: listing.bathrooms,
    },
    {
      icon: <Car className="w-5 h-5" />,
      label: listing.parking ? "Parking Available" : "No Parking",
      available: listing.parking,
    },
    {
      icon: <Sofa className="w-5 h-5" />,
      label: listing.furnished ? "Furnished" : "Unfurnished",
      available: listing.furnished,
    },
  ]

  const discountAmount = listing.offer ? listing.regularPrice - listing.discountPrice : 0
  const finalPrice = listing.offer ? listing.discountPrice : listing.regularPrice

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Image Carousel */}
      <div className="relative">
        <Swiper
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
          className="h-[60vh] lg:h-[70vh]"
        >
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={url}>
              <div
                className="h-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${url})`,
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <Share2 className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={handleSave}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
          >
            <Heart className={`w-5 h-5 ${saved ? "text-red-500 fill-current" : "text-slate-700"}`} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-6 right-6 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {activeImageIndex + 1} / {listing.imageUrls.length}
        </div>

        {/* Copy Success Message */}
        {copied && (
          <div className="absolute top-20 right-6 z-30 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Link copied!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.type === "rent" ? "bg-pink-100 text-pink-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      For {listing.type === "rent" ? "Rent" : "Sale"}
                    </span>
                    {listing.offer && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Special Offer
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{listing.name}</h1>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-5 h-5 text-pink-600" />
                    <span className="text-lg">{listing.address}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-4xl font-bold text-slate-800">
                    ₹{finalPrice.toLocaleString("en-US")}
                    {listing.type === "rent" && <span className="text-xl text-slate-600"> / month</span>}
                  </div>
                  {listing.offer && (
                    <div className="text-xl text-slate-500 line-through">
                      ₹{listing.regularPrice.toLocaleString("en-US")}
                    </div>
                  )}
                </div>
                {listing.offer && (
                  <div className="text-green-600 font-semibold">
                    Save ₹{discountAmount.toLocaleString("en-US")}
                    {listing.type === "rent" && " per month"}
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Property Features</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        feature.available !== false ? "bg-pink-100 text-pink-600" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <p className={`font-medium ${feature.available !== false ? "text-slate-800" : "text-slate-500"}`}>
                      {feature.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">About This Property</h2>
              <p className="text-slate-700 leading-relaxed text-lg">{listing.description}</p>
            </div>

            {/* Property Highlights */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Property Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Home className="w-5 h-5 text-pink-600" />
                  <span className="text-slate-700">Property Type: {listing.type === "rent" ? "Rental" : "Sale"}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-pink-600" />
                  <span className="text-slate-700">Available Now</span>
                </div>
                {listing.parking && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Car className="w-5 h-5 text-pink-600" />
                    <span className="text-slate-700">Parking Included</span>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Sofa className="w-5 h-5 text-pink-600" />
                    <span className="text-slate-700">Fully Furnished</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            {currentUser && listing.userRef !== currentUser._id && (
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Interested in this property?</h3>
                <p className="text-slate-600 mb-6">
                  Get in touch with the landlord for more information or to schedule a viewing.
                </p>

                {!contact ? (
                  <button
                    onClick={() => setContact(true)}
                    className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Contact Landlord
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-800">Contact Form</h4>
                      <button onClick={() => setContact(false)} className="p-1 hover:bg-slate-100 rounded">
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                    <Contact listing={listing} />
                  </div>
                )}
              </div>
            )}

            {/* Property Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Property Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Property Type</span>
                  <span className="font-medium text-slate-800 capitalize">{listing.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bedrooms</span>
                  <span className="font-medium text-slate-800">{listing.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bathrooms</span>
                  <span className="font-medium text-slate-800">{listing.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Parking</span>
                  <span className="font-medium text-slate-800">{listing.parking ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Furnished</span>
                  <span className="font-medium text-slate-800">{listing.furnished ? "Yes" : "No"}</span>
                </div>
                {listing.offer && (
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-slate-600">You Save</span>
                    <span className="font-bold text-green-600">₹{discountAmount.toLocaleString("en-US")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Safety Tips
              </h3>
              <ul className="text-sm text-pink-700 space-y-2">
                <li>• Always verify the property in person</li>
                <li>• Never send money before viewing</li>
                <li>• Meet in a public place first</li>
                <li>• Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperCore from 'swiper';
// import { useSelector } from 'react-redux';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css/bundle';
// import {
//   FaBath,
//   FaBed,
//   FaChair,
//   FaMapMarkedAlt,
//   FaMapMarkerAlt,
//   FaParking,
//   FaShare,
// } from 'react-icons/fa';
// import Contact from '../components/Contact';

// export default function Listing() {
//   SwiperCore.use([Navigation]);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [contact, setContact] = useState(false);
//   const params = useParams();
//   const {currentUser} = useSelector((state) => state.user);
//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
//       {error && (
//         <p className='text-center my-7 text-2xl'>Something went wrong!</p>
//       )}
//       {listing && !loading && !error && (
//         <div>
//           <Swiper navigation>
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className='h-[550px]'
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: 'cover',
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
//             <FaShare
//               className='text-slate-500'
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => {
//                   setCopied(false);
//                 }, 2000);
//               }}
//             />
//           </div>
//           {copied && (
//             <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
//               Link copied!
//             </p>
//           )}
//           <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
//             <p className='text-2xl font-semibold'>
//               {listing.name} - ${' '}
//               {listing.offer
//                 ? listing.discountPrice.toLocaleString('en-US')
//                 : listing.regularPrice.toLocaleString('en-US')}
//               {listing.type === 'rent' && ' / month'}
//             </p>
//             <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
//               <FaMapMarkerAlt className='text-green-700' />
//               {listing.address}
//             </p>
//             <div className='flex gap-4'>
//               <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                 {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
//               </p>
//               {listing.offer && (
//                 <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
//                   ${+listing.regularPrice - +listing.discountPrice} discount
//                 </p>
//               )}
//             </div>
//             <p className='text-slate-800'>
//               <span className='font-semibold text-black'>Description - </span>
//               {listing.description}
//             </p>
//             <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBed className='text-lg' />
//                 {listing.bedrooms > 1
//                   ? `${listing.bedrooms} beds `
//                   : `${listing.bedrooms} bed `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaBath className='text-lg' />
//                 {listing.bathrooms > 1
//                   ? `${listing.bathrooms} baths `
//                   : `${listing.bathrooms} bath `}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaParking className='text-lg' />
//                 {listing.parking ? 'Parking spot' : 'No Parking'}
//               </li>
//               <li className='flex items-center gap-1 whitespace-nowrap '>
//                 <FaChair className='text-lg' />
//                 {listing.furnished ? 'Furnished' : 'Unfurnished'}
//               </li>
//             </ul>
//             {currentUser && listing.userRef !== currentUser._id && !contact && (
//               <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
//                 Contact landlord
//               </button>
//             )}
//             {contact && <Contact listing={listing}/>}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }