"use client"

import { useState } from "react"
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react"

export default function Contact({ listing }) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1000)
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Message Sent!</h3>
        <p className="text-slate-600">The landlord will get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Your Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi, I'm interested in ${listing.name}. Could you please provide more information?`}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function Contact({ listing }) {
//   const [landlord, setLandlord] = useState(null);
//   const [message, setMessage] = useState('');
//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };

//   useEffect(() => {
//     const fetchLandlord = async () => {
//       try {
//         const res = await fetch(`/api/user/${listing.userRef}`);
//         const data = await res.json();
//         setLandlord(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchLandlord();
//   }, [listing.userRef]);
//   return (
//     <>
//       {landlord && (
//         <div className='flex flex-col gap-2'>
//           <p>
//             Contact <span className='font-semibold'>{landlord.username}</span>{' '}
//             for{' '}
//             <span className='font-semibold'>{listing.name.toLowerCase()}</span>
//           </p>
//           <textarea
//             name='message'
//             id='message'
//             rows='2'
//             value={message}
//             onChange={onChange}
//             placeholder='Enter your message here...'
//             className='w-full border p-3 rounded-lg'
//           ></textarea>

//           <Link
//           to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
//           className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message          
//           </Link>
//         </div>
//       )}
//     </>
//   );
// }