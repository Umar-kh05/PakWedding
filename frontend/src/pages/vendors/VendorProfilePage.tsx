import { Link, useParams } from 'react-router-dom'

export default function VendorProfilePage() {
  const { id } = useParams()

  // Sample vendor data - replace with actual API call
  const vendor = {
    id: id || '1',
    name: 'Elite Photography Studio',
    category: 'Photography',
    rating: 4.9,
    reviews: 250,
    location: 'Lahore, Pakistan',
    phone: '+92 300 1234567',
    verified: true,
    topRated: true,
    quickResponse: true,
    packages: [
      {
        name: 'Basic',
        price: 'Rs. 50,000',
        features: [
          'Full day coverage',
          '500+ edited photos',
          'Online gallery',
          '1 photographer'
        ]
      },
      {
        name: 'Standard',
        price: 'Rs. 100,000',
        features: [
          'Full day coverage',
          '800+ edited photos',
          'Online gallery',
          '2 photographers',
          'Drone shots'
        ]
      },
      {
        name: 'Premium',
        price: 'Rs. 200,000',
        features: [
          'Full day coverage',
          '1200+ edited photos',
          'Online gallery',
          '3 photographers',
          'Drone shots',
          'Same day edit video',
          'Photo album'
        ]
      }
    ]
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-pink-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/vendors" className="hover:text-pink-600">Vendors</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{vendor.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{vendor.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Studio Information Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left Side - Studio Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{vendor.name}</h1>
              
              {/* Rating, Location, and Contact in one line */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg text-gray-600">
                    {vendor.rating} ({vendor.reviews} reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vendor.location}</span>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{vendor.phone}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {vendor.verified && (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
                {vendor.topRated && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                    🏆 Top Rated
                  </span>
                )}
                {vendor.quickResponse && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    ⚡ Quick Response
                  </span>
                )}
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-end gap-3">
              <Link
                to={`/bookings/new?vendor=${vendor.id}`}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold whitespace-nowrap transition-colors"
              >
                Book Now
              </Link>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Packages Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Pricing Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendor.packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-pink-600">{pkg.price}</span>
                </div>
                <ul className="space-y-3 mb-6 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/bookings/new?vendor=${vendor.id}&package=${pkg.name}`}
                  className="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center font-semibold py-3 rounded-lg transition-colors mt-auto"
                >
                  Select Package
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
