import { Home, Users, Shield, TrendingUp, Award, MapPin, Phone, Mail } from "lucide-react"

export default function About() {
  const stats = [
    { number: "10K+", label: "Properties Listed" },
    { number: "5K+", label: "Happy Customers" },
    { number: "50+", label: "Cities Covered" },
    { number: "98%", label: "Satisfaction Rate" },
  ]

  const values = [
    {
      icon: <Shield className="w-8 h-8 text-pink-600" />,
      title: "Trust & Transparency",
      description:
        "Every listing is verified and backed by reliable data to ensure complete transparency in your property journey.",
    },
    {
      icon: <Users className="w-8 h-8 text-pink-600" />,
      title: "Customer-Centric",
      description:
        "We put our users first, designing every feature around making your real estate experience seamless and stress-free.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-600" />,
      title: "Innovation",
      description:
        "Leveraging cutting-edge technology to provide smart search, AI-powered recommendations, and real-time market insights.",
    },
    {
      icon: <Award className="w-8 h-8 text-pink-600" />,
      title: "Excellence",
      description:
        "Committed to delivering exceptional service and maintaining the highest standards in everything we do.",
    },
  ]

  const team = [
    {
      name: "Guransh Goyal",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=200&width=200",
      description: "15+ years in real estate technology",
    },
    {
      name: "krishna Goyal",
      role: "CTO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Former tech lead at major proptech companies",
    },
    {
      name: "Ayush Pandey",
      role: "Head of Operations",
      image: "/placeholder.svg?height=200&width=200",
      description: "Expert in real estate operations and customer success",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <Home className="w-16 h-16 text-pink-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-6 text-slate-800 leading-tight">
            About <span className="text-pink-600">Briickly</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing real estate with smart technology, transparent processes, and a customer-first approach to
            property buying, selling, and renting.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="text-pink-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Our Mission</h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              At Briickly, we're on a mission to transform the real estate industry by making property transactions more
              accessible, efficient, and trustworthy for everyone.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We believe that finding the perfect property shouldn't be complicated or stressful. That's why we've built
              a platform that combines powerful technology with human-centered design to create an experience that's
              both sophisticated and simple.
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-indigo-100 p-8 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-pink-600" />
                <span className="text-slate-700">Nationwide Coverage</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-pink-600" />
                <span className="text-slate-700">Verified Listings</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-pink-600" />
                <span className="text-slate-700">Real-time Market Data</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-pink-600" />
                <span className="text-slate-700">Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape the way we serve our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">Meet Our Team</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Passionate professionals dedicated to revolutionizing your real estate experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">{member.name}</h3>
              <p className="text-pink-600 font-medium mb-3">{member.role}</p>
              <p className="text-slate-600">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Founded in 2020, Briickly emerged from a simple observation: the real estate industry was ripe for
              innovation. Our founders, having experienced the frustrations of traditional property transactions
              firsthand, set out to create a better way.
            </p>
            <p>
              What started as a small team with big dreams has grown into a comprehensive platform serving thousands of
              users across the country. We've facilitated millions in property transactions and helped countless
              families find their perfect homes.
            </p>
            <p>
              Today, we continue to push boundaries, introducing new features and technologies that make real estate
              more accessible, transparent, and efficient for everyone involved.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <div className="bg-slate-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect properties with Briickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
              Browse Properties
            </button>
            <button className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
              List Your Property
            </button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>1-800-BRIICKLY</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>hello@briickly.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


// import { Home, Users, Shield, TrendingUp, Award, MapPin } from "lucide-react"

// export default function About() {
//   const stats = [
//     { number: "10K+", label: "Properties Listed" },
//     { number: "5K+", label: "Happy Customers" },
//     { number: "50+", label: "Cities Covered" },
//     { number: "98%", label: "Satisfaction Rate" },
//   ]

//   const values = [
//     {
//       icon: <Shield className="w-8 h-8 text-primary" />,
//       title: "Trust & Transparency",
//       description:
//         "Every listing is verified and backed by reliable data to ensure complete transparency in your property journey.",
//     },
//     {
//       icon: <Users className="w-8 h-8 text-primary" />,
//       title: "Customer-Centric",
//       description:
//         "We put our users first, designing every feature around making your real estate experience seamless and stress-free.",
//     },
//     {
//       icon: <TrendingUp className="w-8 h-8 text-primary" />,
//       title: "Innovation",
//       description:
//         "Leveraging cutting-edge technology to provide smart search, AI-powered recommendations, and real-time market insights.",
//     },
//     {
//       icon: <Award className="w-8 h-8 text-primary" />,
//       title: "Excellence",
//       description:
//         "Committed to delivering exceptional service and maintaining the highest standards in everything we do.",
//     },
//   ]

//   const team = [
//     {
//       name: "Sarah Johnson",
//       role: "CEO & Founder",
//       image: "/placeholder.svg?height=200&width=200",
//       description: "15+ years in real estate technology",
//     },
//     {
//       name: "Michael Chen",
//       role: "CTO",
//       image: "/placeholder.svg?height=200&width=200",
//       description: "Former tech lead at major proptech companies",
//     },
//     {
//       name: "Emily Rodriguez",
//       role: "Head of Operations",
//       image: "/placeholder.svg?height=200&width=200",
//       description: "Expert in real estate operations and customer success",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       {/* Hero Section */}
//       <section className="py-20 px-4 max-w-6xl mx-auto text-center">
//         <div className="mb-8">
//           <Home className="w-16 h-16 text-primary mx-auto mb-4" />
//           <h1 className="text-5xl font-bold mb-6 text-slate-800 leading-tight">
//             About <span className="text-primary">Briickly</span>
//           </h1>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Revolutionizing real estate with smart technology, transparent processes, and a customer-first approach to
//             property buying, selling, and renting.
//           </p>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-primary text-white">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             {stats.map((stat, index) => (
//               <div key={index} className="space-y-2">
//                 <div className="text-4xl font-bold">{stat.number}</div>
//                 <div className="text-secondary">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="py-20 px-4 max-w-6xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-3xl font-bold mb-6 text-slate-800">Our Mission</h2>
//             <p className="text-lg text-slate-700 mb-6 leading-relaxed">
//               At Briickly, we're on a mission to transform the real estate industry by making property transactions more
//               accessible, efficient, and trustworthy for everyone.
//             </p>
//             <p className="text-lg text-slate-700 leading-relaxed">
//               We believe that finding the perfect property shouldn't be complicated or stressful. That's why we've built
//               a platform that combines powerful technology with human-centered design to create an experience that's
//               both sophisticated and simple.
//             </p>
//           </div>
//           <div className="bg-gradient-to-br from-secondary to-white p-8 rounded-2xl">
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <MapPin className="w-6 h-6 text-primary" />
//                 <span className="text-slate-700">Nationwide Coverage</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Shield className="w-6 h-6 text-primary" />
//                 <span className="text-slate-700">Verified Listings</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <TrendingUp className="w-6 h-6 text-primary" />
//                 <span className="text-slate-700">Real-time Market Data</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Users className="w-6 h-6 text-primary" />
//                 <span className="text-slate-700">Expert Support</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="py-20 bg-slate-50">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold mb-4 text-slate-800">Our Core Values</h2>
//             <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//               These principles guide everything we do and shape the way we serve our community.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((value, index) => (
//               <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                 <div className="mb-4">{value.icon}</div>
//                 <h3 className="text-xl font-semibold mb-3 text-slate-800">{value.title}</h3>
//                 <p className="text-slate-600 leading-relaxed">{value.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-20 px-4 max-w-6xl mx-auto">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold mb-4 text-slate-800">Meet Our Team</h2>
//           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//             Passionate professionals dedicated to revolutionizing your real estate experience.
//           </p>
//         </div>
//         <div className="grid md:grid-cols-3 gap-8">
//           {team.map((member, index) => (
//             <div key={index} className="text-center group">
//               <div className="relative mb-6">
//                 <img
//                   src={member.image || "/placeholder.svg"}
//                   alt={member.name}
//                   className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold mb-2 text-slate-800">{member.name}</h3>
//               <p className="text-primary font-medium mb-3">{member.role}</p>
//               <p className="text-slate-600">{member.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-8">Our Story</h2>
//           <div className="space-y-6 text-lg leading-relaxed">
//             <p>
//               Founded in 2020, Briickly emerged from a simple observation: the real estate industry was ripe for
//               innovation...
//             </p>
//             {/* other paragraphs */}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 max-w-6xl mx-auto text-center">
//         <div className="bg-slate-50 rounded-2xl p-12">
//           <h2 className="text-3xl font-bold mb-6 text-slate-800">Ready to Get Started?</h2>
//           <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
//             Join thousands of satisfied customers who have found their perfect properties with Briickly.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
//               Browse Properties
//             </button>
//             <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors">
//               List Your Property
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }
