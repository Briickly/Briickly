"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/bundle"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
import ListingItem from "../components/ListingItem"
import {
  Search,
  Home,
  TrendingUp,
  Shield,
  Users,
  Star,
  MapPin,
  ArrowRight,
  Play,
} from "lucide-react"

export default function HomePage() {
  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  SwiperCore.use([Navigation])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4")
        const data = await res.json()
        setOfferListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4")
        const data = await res.json()
        setRentListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4")
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
    fetchRentListings()
    fetchSaleListings()
  }, [])

  const stats = [
    { number: "10K+", label: "Properties Listed", icon: <Home className="w-6 h-6" /> },
    { number: "5K+", label: "Happy Customers", icon: <Users className="w-6 h-6" /> },
    { number: "50+", label: "Cities Covered", icon: <MapPin className="w-6 h-6" /> },
    { number: "4.9", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
  ]

  const features = [
    {
      icon: <Search className="w-8 h-8 text-pink-600" />,
      title: "Smart Search",
      description: "Find properties with our advanced AI-powered search filters",
    },
    {
      icon: <Shield className="w-8 h-8 text-pink-600" />,
      title: "Verified Listings",
      description: "All properties are verified and backed by reliable data",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-600" />,
      title: "Market Insights",
      description: "Get real-time market trends and property value analytics",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-indigo-600/10"></div>
        <div className="relative flex flex-col gap-8 py-20 lg:py-32 px-4 max-w-7xl mx-auto">
          <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" />
              Welcome to Briickly
            </div>
            <h1 className="text-slate-800 font-bold text-4xl lg:text-7xl leading-tight mb-6">
              Find your next <span className="text-pink-600 hover:text-blue-600 ">perfect</span>
              <br />
              place with ease
            </h1>
            <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl">
              Discover a wide range of properties tailored to your needs. Whether you're looking for a cozy apartment or
              a spacious house, we have something for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Link
                to={"/search"}
                className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                Start Your Search
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center gap-2 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-4 group-hover:bg-pink-200 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="relative">
        <Swiper navigation modules={[Navigation]} className="min-h-[400px] lg:min-h-[600px]">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${listing.imageUrls?.[0] || "/placeholder.jpg"}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="w-full h-full min-h-[400px] flex items-center justify-center relative"
                >
                  <div className="text-center text-white z-10">
                    <h3 className="text-4xl font-bold mb-4">Featured Properties</h3>
                    <p className="text-xl mb-6">Discover amazing deals and exclusive offers</p>
                    <Link
                      to="/search?offer=true"
                      className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                    >
                      View All Offers
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Features */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Why Choose Briickly?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the tools and expertise you need to make informed real estate decisions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow group">
                <div className="mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listing Sections */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Offers */}
        {offerListings.length > 0 && (
          <div className="mb-20">
            <SectionHeader title="🔥 Hot Offers" description="Limited time deals you don't want to miss" link="/search?offer=true" />
            <ListingGrid listings={offerListings} />
          </div>
        )}
        {/* Rent */}
        {rentListings.length > 0 && (
          <div className="mb-20">
            <SectionHeader title="🏠 For Rent" description="Find your perfect rental home" link="/search?type=rent" />
            <ListingGrid listings={rentListings} />
          </div>
        )}
        {/* Sale */}
        {saleListings.length > 0 && (
          <div className="mb-20">
            <SectionHeader title="🏡 For Sale" description="Discover your dream home to buy" link="/search?type=sale" />
            <ListingGrid listings={saleListings} />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-pink-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 text-pink-100">
            Join thousands of satisfied customers who found their perfect homes with Briickly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
              Start Searching
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, description, link }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>
      <Link
        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold group"
        to={link}
      >
        Show more
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}

// FINAL FIXED GRID: horizontal spacing (gap-x-8) and vertical spacing (gap-y-8)
function ListingGrid({ listings }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-28 gap-y-8">
      {listings.map((listing) => (
        <div key={listing._id} className="group">
          <ListingItem listing={listing} />
        </div>
      ))}
    </div>
  )
}





// import { Link } from 'react-router-dom'
// import { useState } from 'react';
// import { useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css/bundle';
// import SwiperCore from 'swiper';
// import { Navigation } from 'swiper/modules';
// import ListingItem from '../components/ListingItem';

// export default function Home() {

//   const [offerListings, setOfferListings] = useState([]);
//   const [rentListings, setRentListings] = useState([]);
//   const [saleListings, setSaleListings] = useState([]);
//   SwiperCore.use([Navigation]);

//   useEffect(() => {
//     const fetchOfferListings = async () => {
//       try {
//         const res = await fetch('/api/listing/get?offer=true&limit=4');
//         const data = await res.json();
//         setOfferListings(data);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     const fetchRentListings = async () => {
//       try {
//         const res = await fetch('/api/listing/get?type=rent&limit=4');
//         const data = await res.json();
//         setRentListings(data);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     const fetchSaleListings = async () => {
//       try {
//         const res = await fetch('/api/listing/get?type=sale&limit=4');
//         const data = await res.json();
//         setSaleListings(data);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     fetchOfferListings();
//     fetchRentListings();
//     fetchSaleListings();
//   }, []);

//   return (
//     <div>

//       {/* {top} */}
//       <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
//         <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
//           Find your next <span className='text-slate-500'>perfect</span>
//           <br />
//           place with ease
//         </h1>
//         <div className="text-gray-400 text-xs sm:text-sm">
//           Discover a wide range of properties tailored to your needs.
//           <br />
//           Whether you're looking for a cozy apartment or a spacious house,
//           we have something for everyone.
//         </div>
//         <Link to={"/search"} className='text-xs sm:text-sm text-pink-800 font-bold hover:underline'>
//           Let's get started
//         </Link>
//       </div>

//       {/* {swiper} */}
//       <Swiper navigation modules={[Navigation]}>
//         {
//           offerListings && offerListings.length > 0 && offerListings.map((listing) => (
//             <SwiperSlide key={listing._id}>
//               <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px] '>
//               </div>
//             </SwiperSlide>
//           ))
//         }
//       </Swiper>

//       {/* {listing results} */}
//       <div className="max-w-6xl flex flex-col mx-auto p-3 gap-8 my-10">
//         {offerListings && offerListings.length > 0 && (
//           <div className="">
//             <div className="my-3">
//               <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
//               <Link className='text-sm text-pink-800 hover:underline' to={'/search?offer=true'}>
//                 Show more offers
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4 ">
//               {
//                 offerListings.map((listing) => (
//                   <ListingItem listing={listing} key={listing._id} />
//                 ))
//               }
//             </div>
//           </div>
//         )}

//         {rentListings && rentListings.length > 0 && (
//           <div className="">
//             <div className="my-3">
//               <h2 className='text-2xl font-semibold text-slate-700'>Recent places for Rent</h2>
//               <Link className='text-sm text-pink-800 hover:underline' to={'/search?type=rent'}>
//                 Show more places for Rent
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4 ">
//               {
//                 rentListings.map((listing) => (
//                   <ListingItem listing={listing} key={listing._id} />
//                 ))
//               }
//             </div>
//           </div>
//         )}

//         {saleListings && saleListings.length > 0 && (
//           <div className="">
//             <div className="my-3">
//               <h2 className='text-2xl font-semibold text-slate-700'>Recent places for sale</h2>
//               <Link className='text-sm text-pink-800 hover:underline' to={'/search?type=sale'}>
//                 Show more places for sale
//               </Link>
//             </div>
//             <div className="flex flex-wrap gap-4 ">
//               {
//                 saleListings.map((listing) => (
//                   <ListingItem listing={listing} key={listing._id} />
//                 ))
//               }
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   )
// }
