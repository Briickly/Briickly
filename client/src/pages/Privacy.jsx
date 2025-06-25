import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-slate-600">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Introduction</h2>
              <p>
                At Briickly, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, email address, phone number)</li>
                <li>Account credentials</li>
                <li>Property preferences and search history</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To personalize your experience</li>
                <li>To communicate with you about our services</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Information Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your
                information with trusted partners who assist us in operating our website and serving our users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You may also
                object to or restrict certain processing of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@briickly.com" className="text-red-600 hover:text-red-700">
                  privacy@briickly.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by
                an updated "Last revised" date and the updated version will be effective as soon as it is
                accessible.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}