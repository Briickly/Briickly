import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700">
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Briickly</span>
          </Link>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sign In
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Terms and Conditions</h1>
          
          <div className="space-y-6 text-slate-600">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Agreement to Terms</h2>
              <p>
                By accessing or using Briickly's website and services, you agree to be bound by these Terms
                and Conditions. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Property Listings</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All listings must be accurate and up-to-date</li>
                <li>You must have the right to list the property</li>
                <li>We reserve the right to remove any listing</li>
                <li>We are not responsible for the accuracy of listings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Intellectual Property</h2>
              <p>
                The website and its original content, features, and functionality are owned by Briickly and
                are protected by international copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Limitation of Liability</h2>
              <p>
                Briickly shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use or inability to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services immediately, without
                prior notice, for any breach of these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any changes
                by updating the "Last modified" date of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the
                jurisdiction in which Briickly operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Contact Us</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at{" "}
                <a href="mailto:legal@briickly.com" className="text-red-600 hover:text-red-700">
                  legal@briickly.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}