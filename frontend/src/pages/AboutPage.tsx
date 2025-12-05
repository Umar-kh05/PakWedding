export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-6">
            About PakWedding
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            Pakistan's #1 wedding planning platform, connecting couples with the best vendors across the country.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            At PakWedding, we believe that every couple deserves a perfect wedding day. Our mission is to simplify 
            the wedding planning process by providing a comprehensive platform where couples can discover, compare, and 
            book the best wedding vendors in Pakistan.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            We're committed to making wedding planning stress-free, transparent, and enjoyable for everyone involved.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-pink-200 transition-all hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-2xl p-10 text-white mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { number: '1000+', label: 'Vendors' },
                { number: '5000+', label: 'Happy Couples' },
                { number: '50+', label: 'Cities' },
                { number: '10K+', label: 'Bookings' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-extrabold mb-2">{stat.number}</div>
                  <div className="text-pink-100 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose PakWedding?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Verified Vendors Only</h3>
                <p className="text-gray-600">All vendors on our platform are verified and reviewed to ensure quality service.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Transparent Pricing</h3>
                <p className="text-gray-600">No hidden fees. See all pricing upfront before making any commitments.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-gray-600">Our support team is always ready to help you with any questions or concerns.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Easy to Use</h3>
                <p className="text-gray-600">Our intuitive platform makes wedding planning simple and enjoyable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

