"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ListingItem from "../components/ListingItem"
import {
  SearchIcon,
  Filter,
  SlidersHorizontal,
  Home,
  Car,
  Sofa,
  Tag,
  Loader2,
  ChevronDown,
  X,
  MapPin,
} from "lucide-react"

export default function Search() {
  const navigate = useNavigate()
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort_order: "created_at",
    order: "desc",
  })

  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    const typeFromUrl = urlParams.get("type")
    const parkingFromUrl = urlParams.get("parking")
    const furnishedFromUrl = urlParams.get("furnished")
    const offerFromUrl = urlParams.get("offer")
    const sortFromUrl = urlParams.get("sort")
    const orderFromUrl = urlParams.get("order")

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      })
    }

    const fetchListings = async () => {
      setLoading(true)
      setShowMore(false)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/listing/get?${searchQuery}`)
      const data = await res.json()
      if (data.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
      setSidebardata({ ...sidebardata, type: e.target.id })
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value })
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false,
      })
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"
      const order = e.target.value.split("_")[1] || "desc"
      setSidebardata({ ...sidebardata, sort, order })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set("searchTerm", sidebardata.searchTerm)
    urlParams.set("type", sidebardata.type)
    urlParams.set("parking", sidebardata.parking)
    urlParams.set("furnished", sidebardata.furnished)
    urlParams.set("offer", sidebardata.offer)
    urlParams.set("sort", sidebardata.sort)
    urlParams.set("order", sidebardata.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`/api/listing/get?${searchQuery}`)
    const data = await res.json()
    if (data.length < 9) {
      setShowMore(false)
    }
    setListings([...listings, ...data])
  }

  const clearFilters = () => {
    setSidebardata({
      searchTerm: "",
      type: "all",
      parking: false,
      furnished: false,
      offer: false,
      sort_order: "created_at",
      order: "desc",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (sidebardata.searchTerm) count++
    if (sidebardata.type !== "all") count++
    if (sidebardata.parking) count++
    if (sidebardata.furnished) count++
    if (sidebardata.offer) count++
    return count
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SearchIcon className="w-6 h-6 text-pink-600" />
              <h1 className="text-2xl font-bold text-slate-800">Property Search</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="bg-white text-pink-600 text-xs px-2 py-1 rounded-full font-bold">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7x mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <div
          className={`lg:w-80 bg-white border-r border-slate-200 ${
            showFilters ? "block" : "hidden lg:block"
          } lg:sticky lg:top-20 lg:h-fit`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-pink-600" />
                <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
              </div>
              {getActiveFiltersCount() > 0 && (
                <button onClick={clearFilters} className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                  Clear All
                </button>
              )}
              <button onClick={() => setShowFilters(false)} className="md:hidden p-1">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Search Term */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Search Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Enter city, neighborhood, or address..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Property Type</label>
                <div className="space-y-3">
                  {[
                    { id: "all", label: "All Properties", icon: <Home className="w-4 h-4" /> },
                    { id: "rent", label: "For Rent", icon: <Home className="w-4 h-4" /> },
                    { id: "sale", label: "For Sale", icon: <Home className="w-4 h-4" /> },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        sidebardata.type === type.id
                          ? "border-pink-600 bg-pink-100 text-pink-700"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={type.id}
                        className="sr-only"
                        onChange={handleChange}
                        checked={sidebardata.type === type.id}
                      />
                      <div className="flex items-center gap-3">
                        {type.icon}
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Features</label>
                <div className="space-y-3">
                  {[
                    { id: "offer", label: "Special Offers", icon: <Tag className="w-4 h-4" /> },
                    { id: "parking", label: "Parking Available", icon: <Car className="w-4 h-4" /> },
                    { id: "furnished", label: "Furnished", icon: <Sofa className="w-4 h-4" /> },
                  ].map((feature) => (
                    <label
                      key={feature.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        sidebardata[feature.id]
                          ? "border-pink-600 bg-pink-100 text-pink-700"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={feature.id}
                        className="sr-only"
                        onChange={handleChange}
                        checked={sidebardata[feature.id]}
                      />
                      <div className="flex items-center gap-3">
                        {feature.icon}
                        <span className="font-medium">{feature.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Sort By</label>
                <div className="relative">
                  <select
                    onChange={handleChange}
                    defaultValue={"createdAt_desc"}
                    id="sort_order"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="regularPrice_desc">Price: High to Low</option>
                    <option value="regularPrice_asc">Price: Low to High</option>
                    <option value="createdAt_desc">Newest First</option>
                    <option value="createdAt_asc">Oldest First</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <SearchIcon className="w-5 h-5" />
                Search Properties
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 lg:ml-0">
          {/* Results Header */}
          <div className="bg-white border-b border-slate-200 p-6 mt-6 lg:mt-0 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {loading ? "Searching..." : `${listings.length} Properties Found`}
                </h2>
                {sidebardata.searchTerm && (
                  <p className="text-slate-600 mt-1">
                    Results for "<span className="font-medium">{sidebardata.searchTerm}</span>"
                  </p>
                )}
              </div>
              {getActiveFiltersCount() > 0 && (
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-sm text-slate-600">Active filters:</span>
                  <span className="bg-pink-300 text-pink-700 text-sm px-3 py-1 rounded-full font-medium">
                    {getActiveFiltersCount()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
                  <p className="text-xl text-slate-600">Searching properties...</p>
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">No Properties Found</h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search criteria or browse all available properties.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div key={listing._id} className="group">
                      <ListingItem listing={listing} />
                    </div>
                  ))}
                </div>

                {/* Show More Button */}
                {showMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={onShowMoreClick}
                      className="bg-white border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-150 transition-colors"
                    >
                      Load More Properties
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import { useState,useEffect } from 'react';
// import ListingItem from '../components/ListingItem';
// export default function Search() {
//     const navigate = useNavigate();
//     const [sidebardata, setSidebardata] = useState({
//     searchTerm: '',
//     type: 'all',
//     parking:  false,
//     furnished: false,
//     offer: false,
//     sort_order: 'created_at',
//     order: 'desc',
// });

// const[loading, setLoading] = useState(false);
// const [listings, setListings] = useState([]);
// const [showMore, setShowMore] = useState(false);




// useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const searchTermFromUrl = urlParams.get('searchTerm');
//     const typeFromUrl = urlParams.get('type');
//     const parkingFromUrl = urlParams.get('parking');
//     const furnishedFromUrl = urlParams.get('furnished');
//     const offerFromUrl = urlParams.get('offer');
//     const sortFromUrl = urlParams.get('sort');
//     const orderFromUrl = urlParams.get('order');

//     if (
//       searchTermFromUrl ||
//       typeFromUrl ||
//       parkingFromUrl ||
//       furnishedFromUrl ||
//       offerFromUrl ||
//       sortFromUrl ||
//       orderFromUrl
//     ) {
//       setSidebardata({
//         searchTerm: searchTermFromUrl || '',
//         type: typeFromUrl || 'all',
//         parking: parkingFromUrl === 'true' ? true : false,
//         furnished: furnishedFromUrl === 'true' ? true : false,
//         offer: offerFromUrl === 'true' ? true : false,
//         sort: sortFromUrl || 'created_at',
//         order: orderFromUrl || 'desc',
//       });
//     }

//     const fetchListings = async () => {
//       setLoading(true);
//       setShowMore(false);
//       const searchQuery = urlParams.toString();
//       const res = await fetch(`/api/listing/get?${searchQuery}`);
//       const data = await res.json();
//       if(data.length>8){
//         setShowMore(true);
//       }
//       else{
//         setShowMore(false);
//       }
//       setListings(data);
//       setLoading(false);
//     };

//     fetchListings();
//   }, [location.search]);
// const handleChange = (e) => {
//     if (
//       e.target.id === 'all' ||
//       e.target.id === 'rent' ||
//       e.target.id === 'sale'
//     ) {
//       setSidebardata({ ...sidebardata, type: e.target.id });
//     }

//     if (e.target.id === 'searchTerm') {
//       setSidebardata({ ...sidebardata, searchTerm: e.target.value });
//     }

//     if (
//       e.target.id === 'parking' ||
//       e.target.id === 'furnished' ||
//       e.target.id === 'offer'
//     ) {
//       setSidebardata({
//         ...sidebardata,
//         [e.target.id]:
//           e.target.checked || e.target.checked === 'true' ? true : false,
//       });
//     }

//     if (e.target.id === 'sort_order') {
//       const sort = e.target.value.split('_')[0] || 'created_at';

//       const order = e.target.value.split('_')[1] || 'desc';

//       setSidebardata({ ...sidebardata, sort, order });
//     }
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const urlParams = new URLSearchParams();
//     urlParams.set('searchTerm', sidebardata.searchTerm);
//     urlParams.set('type', sidebardata.type);
//     urlParams.set('parking', sidebardata.parking);
//     urlParams.set('furnished', sidebardata.furnished);
//     urlParams.set('offer', sidebardata.offer);
//     urlParams.set('sort', sidebardata.sort);
//     urlParams.set('order', sidebardata.order);
//     const searchQuery = urlParams.toString();
//     navigate(`/search?${searchQuery}`);
//   };

//   const onShowMoreClick = async () => {
//     const numberOfListings = listings.length;
//     const startIndex= numberOfListings ;
//     const urlParams = new URLSearchParams(location.search);
//     urlParams.set('start', startIndex);
//     const searchQuery = urlParams.toString();
//     const res = await fetch(`/api/listing/get?${searchQuery}`);
//     const data = await res.json();
//     if(data.length <9) {
//       setShowMore(false);
//     }
//     setListings([...listings, ...data]);
//   };
//   return (
//     <div className='flex flex-col md:flex-row'>
//       <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
//         <form onSubmit = {handleSubmit} className='flex flex-col gap-8'>
//           <div className='flex items-center gap-2'>
//             <label className='whitespace-nowrap font-semibold'>
//               Search Term:
//             </label>
//             <input
//               type='text'
//               id='searchTerm'
//               placeholder='Search...'
//               className='border rounded-lg p-3 w-full'
//               value={sidebardata.searchTerm}
//               onChange = {handleChange}
//             />
//           </div>
//           <div className='flex gap-2 flex-wrap items-center'>
//             <label className='font-semibold'>Type:</label>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='all'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.type === 'all'}
//               />
//               <span>Rent & Sale</span>
//             </div>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='rent'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.type === 'rent'}
//               />
//               <span>Rent</span>
//             </div>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='sale'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.type === 'sale'}
//               />
//               <span>Sale</span>
//             </div>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='offer'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.offer}
//               />
//               <span>Offer</span>
//             </div>
//           </div>
//           <div className='flex gap-2 flex-wrap items-center'>
//             <label className='font-semibold'>Amenities:</label>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='parking'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.parking}
//               />
//               <span>Parking</span>
//             </div>
//             <div className='flex gap-2'>
//               <input
//                 type='checkbox'
//                 id='furnished'
//                 className='w-5'
//                 onChange={handleChange}
//                 checked={sidebardata.furnished}
//               />
//               <span>Furnished</span>
//             </div>
//           </div>
//           <div className='flex items-center gap-2'>
//             <label className='font-semibold'>Sort:</label>
//             <select
//               onChange={handleChange}
//               defaultValue={'createdAt_desc'}
//               id='sort_order'
//               className='border rounded-lg p-3'
//             >
//               <option value='regularPrice_desc'>Price high to low</option>
//               <option value='regularPrice_asc'>Price low to high</option>
//               <option value='createdAt_desc'>Latest</option>
//               <option value='createdAt_asc'>Oldest</option>
//             </select>
//           </div>
//           <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
//             Search
//           </button>
//         </form>
//       </div>
//       <div className='flex-1'>
//         <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
//           Listing results:
//         </h1>
//         <div className = "p-7 flex flex-wrap gap-4">
//             {!loading && listings.length === 0 && (
//                 <p className = 'text-xl text-slate-700'> No listing found!! </p>
//             )}

//             {
//                 loading && (
//                     <p className = 'text-xl text-slate-700 text-center w-full'> Loading... </p>
//                 )
//             }

//             {!loading &&
//             listings &&
//             listings.map((listing) => (
//               <ListingItem key={listing._id} listing={listing} />
//             ))}

//           {showMore && (
//             <button
//               onClick={onShowMoreClick}
//               className='text-color-green-700 hover hover-underline p-4 text-center w-full'
//             >
//               Show More
//             </button>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }
