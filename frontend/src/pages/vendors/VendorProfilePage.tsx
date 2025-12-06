import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchVendorById, Vendor } from '../../services/vendorService'
import BookingModal from '../../components/BookingModal'
import { useAuthStore } from '../../store/authStore'

export default function VendorProfilePage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Vendor ID is required')
        setLoading(false)
        return
      }
      
      // Basic validation: MongoDB ObjectId should be 24 hex characters
      const objectIdPattern = /^[0-9a-fA-F]{24}$/
      if (!objectIdPattern.test(id)) {
        setError('Invalid vendor ID format. Please select a vendor from the list.')
        setLoading(false)
        return
      }
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchVendorById(id)
        // Ensure id is set for vendor
        if (!data.id && data._id) {
          data.id = data._id
        }
        setVendor(data)
      } catch (err: any) {
        console.error('Error fetching vendor:', err)
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to load vendor details'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    
    load()
  }, [id])

  const handleBookNowClick = () => {
    if (!user) {
      alert('Please log in to book a vendor.')
      return
    }
    setIsBookingModalOpen(true)
  }

  const handleBookingSuccess = () => {
    alert('Booking request sent successfully!')
    setIsBookingModalOpen(false)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-white to-accent-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-white to-accent-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-100">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-primary-600 text-xl font-bold mb-2">{error || 'Vendor not found'}</p>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>←</span> Back to Vendors
          </Link>
        </div>
      </div>
    )
  }

  const vendorId = vendor.id || vendor._id || id || ''
  const displayName = vendor.business_name
  const displayCategory = vendor.service_category
  const displayLocation = vendor.business_address
  const displayPhone = vendor.phone_number
  const displayEmail = vendor.email
  const displayContactPerson = vendor.contact_person
  const displayDescription = vendor.description
  const rating = vendor.rating ?? 0
  const totalBookings = vendor.total_bookings ?? 0
  const galleryImages = vendor.gallery_images || []

  return (
    <div className="bg-gradient-to-br from-rose-50/30 via-white to-accent-50/30 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-white via-rose-50/50 to-white border-b border-rose-100/60 py-4 shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600 flex items-center gap-2">
            <Link to="/" className="hover:text-primary-600 transition-colors duration-300 font-medium">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/vendors" className="hover:text-primary-600 transition-colors duration-300 font-medium">Vendors</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{displayCategory}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Vendor Image Section */}
        {vendor.image_url && (
          <div className="mb-8 relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-primary-100/50 group-hover:ring-primary-300/70 transition-all duration-300">
              <img 
                src={vendor.image_url.startsWith('http') ? vendor.image_url : `http://localhost:8000${vendor.image_url}`}
                alt={displayName}
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              {/* Decorative border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-2xl opacity-20 blur-xl -z-10"></div>
            </div>
          </div>
        )}

        {/* Vendor Information Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-100/50 hover:border-primary-200 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left Side - Vendor Info */}
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-4">
                  {displayName}
                </h1>
                
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-sm font-bold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <span className="mr-2">🏷️</span>
                    {displayCategory}
                  </span>
                </div>
                
                {/* Rating, Location, and Contact */}
                <div className="flex items-center gap-6 mb-6 flex-wrap">
                  {/* Rating */}
                  {rating > 0 && (
                    <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-2 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg font-bold text-gray-800">
                        {rating.toFixed(1)} <span className="text-sm font-normal text-gray-600">({totalBookings} {totalBookings === 1 ? 'booking' : 'bookings'})</span>
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{displayLocation}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium">{displayPhone}</span>
                  </div>
                </div>

                {/* Contact Person and Email */}
                <div className="mb-6 space-y-3">
                  {displayContactPerson && (
                    <div className="flex items-center gap-3 text-gray-700 bg-gradient-to-r from-rose-50 to-accent-50 px-4 py-3 rounded-xl border border-rose-200 hover:border-primary-300 transition-all duration-300">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">Contact Person:</span>
                      <span>{displayContactPerson}</span>
                    </div>
                  )}
                  {displayEmail && (
                    <div className="flex items-center gap-3 text-gray-700 bg-gradient-to-r from-rose-50 to-accent-50 px-4 py-3 rounded-xl border border-rose-200 hover:border-primary-300 transition-all duration-300">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">Email:</span>
                      <a href={`mailto:${displayEmail}`} className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300 hover:underline">
                        {displayEmail}
                      </a>
                    </div>
                  )}
                </div>

                {/* Description */}
                {displayDescription && (
                  <div className="mt-8 bg-gradient-to-br from-gray-50 to-rose-50/30 p-6 rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all duration-300">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-4">About</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                      {displayDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex flex-col items-start md:items-end gap-4">
                <button
                  onClick={handleBookNowClick}
                  className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-10 py-4 rounded-xl text-lg font-bold whitespace-nowrap transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary-600/50 transform hover:scale-105 w-full md:w-auto"
                >
                  {user ? '📅 Book Now' : '🔐 Login to Book'}
                </button>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-white border-2 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105">
                    <svg className="w-6 h-6 text-primary-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="flex-1 md:flex-none bg-white border-2 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105">
                    <svg className="w-6 h-6 text-primary-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Images Section */}
        {galleryImages.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-3">
                Gallery
              </h2>
              <p className="text-gray-600 text-lg">Explore our work and portfolio</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-300"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`}
                      alt={`${displayName} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-white font-semibold text-sm">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        <div className="bg-gradient-to-br from-white via-rose-50/30 to-accent-50/30 rounded-2xl p-8 mb-16 border-2 border-rose-100/50 shadow-xl hover:shadow-2xl hover:border-primary-200 transition-all duration-300">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-8 text-center">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                Business Details
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 min-w-[120px]">Business Name:</span>
                  <span>{displayName}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 min-w-[120px]">Category:</span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                    {displayCategory}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 min-w-[120px]">Address:</span>
                  <span>{displayLocation}</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                Contact Details
              </h3>
              <div className="space-y-3 text-gray-700">
                {displayContactPerson && (
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary-600 min-w-[120px]">Contact Person:</span>
                    <span>{displayContactPerson}</span>
                  </p>
                )}
                <p className="flex items-start gap-2">
                  <span className="font-bold text-primary-600 min-w-[120px]">Phone:</span>
                  <a href={`tel:${displayPhone}`} className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300 hover:underline">
                    {displayPhone}
                  </a>
                </p>
                {displayEmail && (
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary-600 min-w-[120px]">Email:</span>
                    <a href={`mailto:${displayEmail}`} className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300 hover:underline break-all">
                      {displayEmail}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {vendor && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
          vendorId={vendorId}
          vendorName={displayName}
        />
      )}
    </div>
  )
}
