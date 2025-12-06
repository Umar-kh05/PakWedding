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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-gray-500">Loading vendor details...</p>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Vendor not found'}</p>
          <Link
            to="/vendors"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            ← Back to Vendors
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
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-pink-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/vendors" className="hover:text-pink-600">Vendors</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{displayCategory}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Vendor Image Section */}
        {vendor.image_url && (
          <div className="mb-8">
            <img 
              src={vendor.image_url.startsWith('http') ? vendor.image_url : `http://localhost:8000${vendor.image_url}`}
              alt={displayName}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Vendor Information Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left Side - Vendor Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{displayName}</h1>
              
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-pink-100 text-pink-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {displayCategory}
                </span>
              </div>
              
              {/* Rating, Location, and Contact */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg text-gray-600">
                      {rating.toFixed(1)} ({totalBookings} {totalBookings === 1 ? 'booking' : 'bookings'})
                    </span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{displayLocation}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{displayPhone}</span>
                </div>
              </div>

              {/* Contact Person and Email */}
              <div className="mb-4 space-y-2">
                {displayContactPerson && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Contact Person:</span>
                    <span>{displayContactPerson}</span>
                  </div>
                )}
                {displayEmail && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${displayEmail}`} className="text-pink-600 hover:text-pink-700">
                      {displayEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {displayDescription && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {displayDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-start md:items-end gap-3">
              <button
                onClick={handleBookNowClick}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg font-semibold whitespace-nowrap transition-colors w-full md:w-auto"
              >
                {user ? 'Book Now' : 'Login to Book'}
              </button>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="flex-1 md:flex-none bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Images Section */}
        {galleryImages.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`}
                    alt={`${displayName} gallery ${index + 1}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Business Details</h3>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Business Name:</span> {displayName}</p>
                <p><span className="font-medium">Category:</span> {displayCategory}</p>
                <p><span className="font-medium">Address:</span> {displayLocation}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Details</h3>
              <div className="space-y-2 text-gray-600">
                {displayContactPerson && (
                  <p><span className="font-medium">Contact Person:</span> {displayContactPerson}</p>
                )}
                <p><span className="font-medium">Phone:</span> {displayPhone}</p>
                {displayEmail && (
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${displayEmail}`} className="text-pink-600 hover:text-pink-700">
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
