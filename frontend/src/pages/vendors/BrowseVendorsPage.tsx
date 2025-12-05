import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchVendors, Vendor } from '../../services/vendorService'
import BookingModal from '../../components/BookingModal'
import { useAuthStore } from '../../store/authStore'

type UiVendor = Vendor & {
  rating?: number
  reviews?: number
  startingPrice?: string
}

export default function BrowseVendorsPage() {
  const [vendors, setVendors] = useState<UiVendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<UiVendor[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<UiVendor | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { user } = useAuthStore()
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [priceRange, setPriceRange] = useState<string>('')
  const [minRating, setMinRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>('popular')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Fallback sample data if API returns no vendors yet
  const fallbackVendors: UiVendor[] = [
    {
      _id: '1',
      business_name: 'Elite Photography Studio',
      service_category: 'Photography',
      rating: 4.9,
      reviews: 250,
      business_address: 'Lahore, Pakistan',
      phone_number: '+92 300 1234567',
      contact_person: '',
      email: '',
      startingPrice: 'Rs. 50,000',
    },
  ]

  // Get unique categories and locations from vendors
  const categories = Array.from(new Set(vendors.map(v => v.service_category).filter(Boolean)))
  const locations = Array.from(new Set(vendors.map(v => v.business_address).filter(Boolean)))

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchVendors()
        console.log('Fetched vendors:', data)
        if (data && data.length > 0) {
          // Map API vendors to UI fields while keeping existing design
          const mappedVendors = data.map((v) => ({
            ...v,
            _id: v._id || v.id || '',
            id: v.id || v._id || '',
            rating: v.rating ?? 4.8,
            reviews: v.total_bookings ?? 0,
            startingPrice: 'Rs. 50,000',
          }))
          setVendors(mappedVendors)
          setFilteredVendors(mappedVendors)
        } else {
          // Only show fallback if no vendors found
          console.log('No vendors found, showing fallback')
          setVendors(fallbackVendors)
          setFilteredVendors(fallbackVendors)
        }
      } catch (err) {
        console.error('Error fetching vendors:', err)
        // If API fails, fall back to sample list so page still works
        setVendors(fallbackVendors)
        setFilteredVendors(fallbackVendors)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...vendors]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.business_name.toLowerCase().includes(query) ||
        v.service_category.toLowerCase().includes(query) ||
        v.business_address.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(v => v.service_category === selectedCategory)
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(v => v.business_address.includes(selectedLocation))
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(v => (v.rating || 0) >= minRating)
    }

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.business_name.localeCompare(b.business_name))
    }

    setFilteredVendors(filtered)

    // Update active filters display
    const filters: string[] = []
    if (selectedCategory) filters.push(selectedCategory)
    if (selectedLocation) filters.push(selectedLocation)
    if (minRating > 0) filters.push(`${minRating}+ Rating`)
    if (priceRange) filters.push(priceRange)
    setActiveFilters(filters)
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, minRating, sortBy, vendors])

  const handleRemoveFilter = (filter: string) => {
    if (filter.includes('Rating')) {
      setMinRating(0)
    } else if (categories.includes(filter)) {
      setSelectedCategory('')
    } else if (locations.some(loc => loc.includes(filter))) {
      setSelectedLocation('')
    } else if (filter.includes('Rs.')) {
      setPriceRange('')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-3">
          Find Your Perfect Wedding Vendors
        </h1>
        <p className="text-gray-700 font-medium mb-8">
          Browse through 1000+ verified vendors across Pakistan
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name, category, or location..."
            className="flex-1 h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white h-14 px-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 bg-white"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 bg-white"
          >
            <option value="0">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-14 px-5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 bg-white"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-6">
            <span className="text-sm font-semibold text-gray-700 mr-3">Active Filters:</span>
            <div className="inline-flex flex-wrap gap-3">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium border border-pink-200 flex items-center gap-2"
                >
                  {filter}
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="hover:text-pink-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results + Sort */}
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm mb-6">
        <p className="font-semibold">{loading ? 'Loading vendors...' : `Showing ${filteredVendors.length} of ${vendors.length} results`}</p>
      </div>

      {/* Vendors Grid */}
      <div className="container mx-auto px-6 pb-12">
        {filteredVendors.length === 0 && !loading ? (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-gray-400 mb-4">No vendors found</p>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredVendors.map((vendor) => (
            <div
              key={vendor._id || vendor.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-pink-300 group"
            >
              <div className="bg-gray-100 h-48 w-full overflow-hidden relative">
                {vendor.image_url ? (
                  <img 
                    src={vendor.image_url.startsWith('http') ? vendor.image_url : `http://localhost:8000${vendor.image_url}`}
                    alt={vendor.business_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {/* Hover overlay with Book button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {user ? (
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setIsBookingModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                    >
                      Book Now
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                    >
                      Login to Book
                    </Link>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-gray-500 mb-2">{vendor.service_category}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{vendor.business_name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {vendor.rating} ({vendor.reviews} reviews)
                  </span>
                  <span>•</span>
                  <span>{vendor.business_address}</span>
                </div>
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg mb-4">
                  Starting from {vendor.startingPrice}
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/vendors/${vendor._id || vendor.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold hover:underline flex-1"
                  >
                    View Profile →
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setIsBookingModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md"
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Booking Modal */}
        {selectedVendor && (
          <BookingModal
            vendorId={selectedVendor._id || selectedVendor.id || ''}
            vendorName={selectedVendor.business_name}
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false)
              setSelectedVendor(null)
            }}
            onSuccess={() => {
              alert('Booking request submitted successfully! The vendor will review and respond.')
            }}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3">
          <button className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">←</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg ${
                page === 2 ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'border-2 border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50'
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
