import { Link } from 'react-router-dom'

export default function BrowseVendorsPage() {
  // Sample vendor data - replace with actual API call
  const vendors = [
    {
      id: '1',
      name: 'Elite Photography Studio',
      category: 'Photography',
      rating: 4.9,
      reviews: 250,
      location: 'Lahore, Pakistan',
      phone: '+92 300 1234567',
      verified: true,
      topRated: true,
      quickResponse: true,
      startingPrice: 'Rs. 50,000',
      image: 'https://via.placeholder.com/400x300?text=Elite+Photography'
    },
    {
      id: '2',
      name: 'Royal Catering Services',
      category: 'Catering',
      rating: 4.8,
      reviews: 180,
      location: 'Karachi, Pakistan',
      phone: '+92 300 2345678',
      verified: true,
      topRated: false,
      quickResponse: true,
      startingPrice: 'Rs. 80,000',
      image: 'https://via.placeholder.com/400x300?text=Royal+Catering'
    },
    {
      id: '3',
      name: 'Dream Wedding Venue',
      category: 'Venue',
      rating: 4.7,
      reviews: 320,
      location: 'Islamabad, Pakistan',
      phone: '+92 300 3456789',
      verified: true,
      topRated: true,
      quickResponse: false,
      startingPrice: 'Rs. 150,000',
      image: 'https://via.placeholder.com/400x300?text=Dream+Venue'
    },
    {
      id: '4',
      name: 'Bridal Makeup by Sarah',
      category: 'Makeup',
      rating: 4.9,
      reviews: 145,
      location: 'Lahore, Pakistan',
      phone: '+92 300 4567890',
      verified: true,
      topRated: true,
      quickResponse: true,
      startingPrice: 'Rs. 25,000',
      image: 'https://via.placeholder.com/400x300?text=Bridal+Makeup'
    },
    {
      id: '5',
      name: 'Melody Music Band',
      category: 'Entertainment',
      rating: 4.6,
      reviews: 95,
      location: 'Karachi, Pakistan',
      phone: '+92 300 5678901',
      verified: true,
      topRated: false,
      quickResponse: true,
      startingPrice: 'Rs. 60,000',
      image: 'https://via.placeholder.com/400x300?text=Melody+Music'
    },
    {
      id: '6',
      name: 'Floral Decorations Co.',
      category: 'Decoration',
      rating: 4.8,
      reviews: 210,
      location: 'Lahore, Pakistan',
      phone: '+92 300 6789012',
      verified: true,
      topRated: true,
      quickResponse: true,
      startingPrice: 'Rs. 40,000',
      image: 'https://via.placeholder.com/400x300?text=Floral+Decor'
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-pink-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Vendors</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Vendors</h1>
        <p className="text-gray-600">Browse through our verified vendors and find the best services for your wedding</p>
      </div>

      {/* Vendors Grid */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Vendor Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {vendor.rating} ({vendor.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vendor.location}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.verified && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      ✓ Verified
                    </span>
                  )}
                  {vendor.topRated && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      🏆 Top Rated
                    </span>
                  )}
                  {vendor.quickResponse && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      ⚡ Quick Response
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-pink-600">Starting from {vendor.startingPrice}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/bookings/new?vendor=${vendor.id}`}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
                  >
                    Book Now
                  </Link>
                  <Link
                    to={`/vendors/${vendor.id}`}
                    className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 text-center font-semibold py-3 rounded-lg transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
