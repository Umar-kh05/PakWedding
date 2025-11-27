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
      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Find Your Perfect Wedding Vendors
        </h1>
        <p className="text-gray-600 mb-8">
          Browse through 1000+ verified vendors across Pakistan
        </p>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search vendors by name, category, or location..."
            className="flex-1 h-14 px-5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button className="bg-pink-600 hover:bg-pink-700 text-white h-14 px-12 rounded-xl font-semibold">
            Search
          </button>
          <input
            type="text"
            placeholder="Add filter"
            className="w-full md:w-60 h-14 px-5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Active Filters */}
        <div className="mt-6">
          <span className="text-sm font-semibold text-gray-700 mr-3">Active Filters:</span>
          <div className="inline-flex flex-wrap gap-3">
            {['Photography', 'Lahore', 'Rs. 50k-100k', '4+ Rating'].map((filter) => (
              <span
                key={filter}
                className="bg-purple-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {filter} ×
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results + Sort */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm mb-6">
        <p>Showing 24 results</p>
        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <button className="border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
            Most Popular ▼
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-100 h-48 w-full" />
              <div className="p-6">
                <p className="text-sm font-semibold text-gray-500 mb-2">{vendor.category}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{vendor.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {vendor.rating} ({vendor.reviews} reviews)
                  </span>
                  <span>•</span>
                  <span>{vendor.location}</span>
                </div>
                <div className="text-pink-600 font-semibold text-lg mb-4">
                  Starting from {vendor.startingPrice}
                </div>
                <Link
                  to={`/vendors/${vendor.id}`}
                  className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3">
          <button className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">←</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg ${
                page === 2 ? 'bg-pink-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">→</button>
        </div>
      </div>
    </div>
  )
}
