import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || '',
    password: '',
  });
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/sign-in', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'my_unsigned');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/duvqbiq0s/image/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
        setFilePerc(100);
        setFileUploadError(false);
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFileUploadError(true);
      setFilePerc(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser._id) {
      dispatch(updateUserFailure('User not authenticated'));
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser || !currentUser._id) {
      dispatch(deleteUserFailure('User not authenticated'));
      navigate('/sign-in', { replace: true });
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${text}`);
      }
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in', { replace: true });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      navigate('/sign-in', { replace: true });
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Sign out failed: ${res.status}`);
      }
      dispatch(signOut()); // Use the correct signOut action
      navigate('/sign-in', { replace: true }); // Fixed typo in path
    } catch (error) {
      console.error('Sign out failed:', error);
      dispatch(signOut()); // Clear state even on error
      navigate('/sign-in', { replace: true });
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        {formData.avatar && (
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
        )}

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image size must be less than 10MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded</span>
          ) : (
            ''
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser?.username}
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link 
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' 
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      {error && <p className="text-red-700 text-sm mt-2">{error}</p>}

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-800 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-800 cursor-pointer">
          Sign Out
        </span>
      </div>

      {/* <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p> */}

      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
  
              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}


// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

// export default function Profile() {
//   const fileRef = useRef(null);
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const [file, setFile] = useState(undefined);
//   const [filePerc, setFilePerc] = useState(0);
//   const [fileUploadError, setFileUploadError] = useState(false);

//   const [formData, setFormData] = useState({
//     username: currentUser.username || '',
//     email: currentUser.email || '',
//     avatar: currentUser.avatar || '',
//     password: ''
//   });

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleFileUpload = async (file) => {
//     const formDataUpload = new FormData();
//     formDataUpload.append("file", file);
//     formDataUpload.append("upload_preset", "my_unsigned");

//     try {
//       const res = await fetch("https://api.cloudinary.com/v1_1/duvqbiq0s/image/upload", {
//         method: "POST",
//         body: formDataUpload,
//       });

//       const data = await res.json();

//       if (data.secure_url) {
//         setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
//         setFilePerc(100);
//         setFileUploadError(false);
//       } else {
//         throw new Error("Upload failed");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       setFileUploadError(true);
//       setFilePerc(0);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data.message));
//         return;
//       }
//       dispatch(updateUserSuccess(data));
//     } catch (error) {
//       dispatch(updateUserFailure(error.message));
//     }
//   };

//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
//       <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
//         <input
//           onChange={(e) => setFile(e.target.files[0])}
//           type="file"
//           ref={fileRef}
//           hidden
//           accept="image/*"
//         />

//         <img
//           onClick={() => fileRef.current.click()}
//           src={formData.avatar}
//           alt="profile"
//           className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
//         />

//         <p className="text-sm self-center">
//           {fileUploadError ? (
//             <span className="text-red-700">Error Image Upload (must be less than 10MB)</span>
//           ) : filePerc > 0 && filePerc < 100 ? (
//             <span className="text-slate-700">Uploading {filePerc}%</span>
//           ) : filePerc === 100 ? (
//             <span className="text-green-700">Image Uploaded</span>
//           ) : (
//             ''
//           )}
//         </p>

//         <input
//           type="text"
//           placeholder="Username"
//           id="username"
//           className="border p-3 rounded-lg"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           id="email"
//           className="border p-3 rounded-lg"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="New Password (optional)"
//           id="password"
//           className="border p-3 rounded-lg"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />

//         <button
//           disabled={loading}
//           className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? 'Loading...' : 'Update'}
//         </button>
//       </form>

//       <div className="flex justify-between mt-5">
//         <span className="text-red-800 cursor-pointer">Delete Account</span>
//         <span className="text-red-800 cursor-pointer">Sign Out</span>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess } from '../redux/user/userSlice';
// import { useNavigate } from 'react-router-dom';

// export default function Profile() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileRef = useRef(null);
//   const { currentUser, loading, error } = useSelector((state) => state.user);
//   const [file, setFile] = useState(undefined);
//   const [filePerc, setFilePerc] = useState(0);
//   const [fileUploadError, setFileUploadError] = useState(false);
//   const [formData, setFormData] = useState({
//     username: currentUser?.username || '',
//     email: currentUser?.email || '',
//     avatar: currentUser?.avatar || '',
//     password: '',
//   });

//   useEffect(() => {
//     if (!currentUser) {
//       navigate('/login');
//     }
//   }, [currentUser, navigate]);

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleFileUpload = async (file) => {
//     const formDataUpload = new FormData();
//     formDataUpload.append('file', file);
//     formDataUpload.append('upload_preset', 'my_unsigned');

//     try {
//       const res = await fetch('https://api.cloudinary.com/v1_1/duvqbiq0s/image/upload', {
//         method: 'POST',
//         body: formDataUpload,
//       });

//       const data = await res.json();

//       if (data.secure_url) {
//         setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
//         setFilePerc(100);
//         setFileUploadError(false);
//       } else {
//         throw new Error(data.error?.message || 'Image upload failed');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setFileUploadError(true);
//       setFilePerc(0);
//     }
//   };

//   const handleSubmit = async (e) => {
//     // e.preventDefault();
//     if (!currentUser || !currentUser._id) {
//       dispatch(updateUserFailure('User not authenticated'));
//       return;
//     }
//     try {
//       dispatch(updateUserStart());
//       const res = await fetch(`/api/user/update/${currentUser._id}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         dispatch(updateUserFailure(data.message));
//         return;
//       }
//       dispatch(updateUserSuccess(data));
//     } catch (error) {
//       dispatch(updateUserFailure(error.message));
//     }
//   };
//   // const handleDeleteUser = async() => {
//   //     try{
//   //       dispatch(deleteUserStart());
//   //       const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//   //           method: 'DELETE',
//   //       });

//   //       const data = await res.json();
//   //       if(data.success == false){
//   //          dispatch(deleteUserFailure(data.message));
//   //          return;
//   //       }
//   //       dispatch(deleteUserSuccess(data));
//   //     }
//   //     catch(error){
//   //        dispatch(deleteUserFailure(error.message));
//   //     }
//   // }
//   const handleDeleteUser = async () => {
//   if (!currentUser || !currentUser._id) {
//     dispatch(deleteUserFailure('User not authenticated'));
//     return;
//   }
//   try {
//     dispatch(deleteUserStart());
//     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
//       method: 'DELETE',
//       credentials: 'include',
//     });
//     if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
//       const contentType = res.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await res.text();
//         console.log('Non-JSON response:', text);
//         throw new Error('Response is not valid JSON');
//     }
//     const data = await res.json();
//     if (data.success === false) {
//       dispatch(deleteUserFailure(data.message));
//       return;
//     }
//     dispatch(deleteUserSuccess());
//     navigate('/sign-in',{replace: true});
//   } catch (error) {
//     dispatch(deleteUserFailure(error.message));
//     navigate('/sign-in', { replace: true });
//   }
// };
// const handleSignOut = async () => {
//     // try {
//     //   await fetch('/api/auth/signout', { method: 'POST', credentials: 'include'});
//     //   dispatch(handleSignOut());
//     //   navigate('/sign-in', { replace: true });
//     // } catch (error) {
//     //   console.error('Sign out failed:', error);
//     //   dispatch(handleSignOut());
//     //   navigate('/sign-In', {replace: true});
//     // }
//     try {
//     const res = await fetch('/api/auth/signout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     if (!res.ok) {
//       throw new Error(`Sign out failed: ${res.status}`);
//     }
//     dispatch(signOutSuccess());
//     navigate('/sign-in', { replace: true });
//   } catch (error) {
//     console.error('Sign out failed:', error);
//     dispatch(signOutSuccess());
//     navigate('/sign-in', { replace: true });
//   }
// };
//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           onChange={(e) => setFile(e.target.files[0])}
//           type="file"
//           ref={fileRef}
//           hidden
//           accept="image/*"
//         />

//         {formData.avatar && (
//           <img
//             onClick={() => fileRef.current.click()}
//             src={formData.avatar}
//             alt="profile"
//             className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
//           />
//         )}

//         <p className="text-sm self-center">
//           {fileUploadError ? (
//             <span className="text-red-700">
//               Error Image Upload (image size must be less than 10MB)
//             </span>
//           ) : filePerc > 0 && filePerc < 100 ? (
//             <span className="text-slate-700">Uploading {filePerc}%</span>
//           ) : filePerc === 100 ? (
//             <span className="text-green-700">Image Successfully Uploaded</span>
//           ) : (
//             ''
//           )}
//         </p>

//         <input
//           type="text"
//           placeholder="username"
//           id="username"
//           defaultValue={currentUser?.username}
//           className="border p-3 rounded-lg"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         />

//         <input
//           type="email"
//           placeholder="email"
//           id="email"
//           defaultValue={currentUser?.email}
//           className="border p-3 rounded-lg"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="password"
//           id="password"
//           className="border p-3 rounded-lg"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />

//         <button
//           disabled={loading}
//           className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
//         >
//           {loading ? 'Loading...' : 'Update'}
//         </button>
//       </form>

//       {error && <p className="text-red-700 text-sm mt-2">{error}</p>}

//       <div className="flex justify-between mt-5">
//         <span onClick = {handleDeleteUser} className="text-red-800 cursor-pointer">Delete Account</span>
//         <span onClick = {handleSignOut} className="text-red-800 cursor-pointer">Sign Out</span>
//       </div>
//     </div>
//   );
// }
