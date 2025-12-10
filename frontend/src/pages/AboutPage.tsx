import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 space-y-4 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#D72626] hover:text-[#F26D46] font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#D72626] bg-clip-text text-transparent mb-3 pb-2 leading-tight">
            About PakWedding
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 font-medium max-w-3xl leading-relaxed">
            Pakistan's #1 wedding planning platform, connecting couples with the best vendors across the country.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-8 border-2 border-primary-200 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D72626] mb-4 sm:mb-6">Our Mission</h2>
          <p className="text-gray-800 leading-relaxed text-base sm:text-lg mb-4">
            At PakWedding, we believe that every couple deserves a perfect wedding day. Our mission is to simplify 
            the wedding planning process by providing a comprehensive platform where couples can discover, compare, and 
            book the best wedding vendors in Pakistan.
          </p>
          <p className="text-gray-800 leading-relaxed text-base sm:text-lg">
            We're committed to making wedding planning stress-free, transparent, and enjoyable for everyone involved.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            {
              icon: '🔍',
              title: '1000+ Verified Vendors',
              description: 'Browse through our extensive network of verified wedding vendors across Pakistan.'
            },
            {
              icon: '💰',
              title: 'Budget Planning',
              description: 'Plan and track your wedding expenses with our comprehensive budget planner tool.'
            },
            {
              icon: '⭐',
              title: 'Real Reviews',
              description: 'Read authentic reviews from real couples to make informed decisions.'
            },
            {
              icon: '📅',
              title: 'Easy Booking',
              description: 'Book your favorite vendors directly through our platform with just a few clicks.'
            },
            {
              icon: '🎨',
              title: 'Multiple Categories',
              description: 'Find vendors for venues, catering, photography, decoration, and much more.'
            },
            {
              icon: '🛡️',
              title: 'Secure & Trusted',
              description: 'Your data and transactions are secure with our industry-standard security measures.'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-primary-200 hover:border-primary-400 transition-all hover:shadow-2xl text-left"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-[#D72626]">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-[#D72626] mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-12 border-2 border-primary-200 relative overflow-hidden text-left">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26D46] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F7A76C] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[#D72626] to-[#F26D46] bg-clip-text text-transparent pb-1 leading-normal">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { number: '1000+', label: 'Vendors' },
                { number: '5000+', label: 'Happy Couples' },
                { number: '50+', label: 'Cities' },
                { number: '10K+', label: 'Bookings' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 sm:p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-[#F7A76C]/20 hover:border-[#F7A76C] hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2 bg-gradient-to-r from-[#D72626] to-[#F26D46] bg-clip-text text-transparent">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-[#D72626] font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 border-primary-200 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D72626] mb-4 sm:mb-6 pb-1 leading-normal">Why Choose PakWedding?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D72626] to-[#F26D46] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#D72626] mb-1">Verified Vendors Only</h3>
                <p className="text-gray-800">All vendors on our platform are verified and reviewed to ensure quality service.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D72626] to-[#F26D46] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#D72626] mb-1">Transparent Pricing</h3>
                <p className="text-gray-800">No hidden fees. See all pricing upfront before making any commitments.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D72626] to-[#F26D46] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#D72626] mb-1">24/7 Support</h3>
                <p className="text-gray-800">Our support team is always ready to help you with any questions or concerns.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D72626] to-[#F26D46] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-[#D72626] mb-1">Easy to Use</h3>
                <p className="text-gray-800">Our intuitive platform makes wedding planning simple and enjoyable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

