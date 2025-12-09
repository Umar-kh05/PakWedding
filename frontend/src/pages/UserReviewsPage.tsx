import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { fetchVendors, Vendor } from '../services/vendorService'
import Sidebar from '../components/Sidebar'

interface Review {
  id: string
  vendor_id: string
  rating: number
  comment?: string
  created_at: string
}

export default function UserReviewsPage() {
  const { user } = useAuthStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [vendors, setVendors] = useState<Record<string, Vendor>>({})
  const [loading, setLoading] = useState(true)

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bookings/history', label: 'My Bookings', icon: '📅' },
    { path: '/budget-planner', label: 'Budget Planner', icon: '💰' },
    { path: '/checklist', label: 'Checklist', icon: '✅' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/reviews', label: 'My Reviews', icon: '⭐' },
  ]

  useEffect(() => {
    if (user) {
      loadReviews()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reviews/user')
      const reviewsData = response.data || []
      setReviews(reviewsData)

      // Load vendor details for each review
      const vendorIds = reviewsData.map((r: Review) => r.vendor_id)
      const allVendors = await fetchVendors(undefined, 500)
      const vendorMap: Record<string, Vendor> = {}
      allVendors.forEach((v: Vendor) => {
        if (vendorIds.includes(v._id || v.id)) {
          vendorMap[v._id || v.id] = v
        }
      })
      setVendors(vendorMap)
    } catch (err: any) {
      console.error('Error loading reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-rose-100">
          <p className="text-xl text-gray-700 mb-4">Please log in to view your reviews.</p>
          <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="User Dashboard" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
            My Reviews
          </h1>
          <p className="text-gray-600">All reviews you've made for vendors</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-gray-100">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">Start reviewing vendors after your bookings!</p>
            <Link
              to="/vendors"
              className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const vendor = vendors[review.vendor_id]
              if (!vendor) return null

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-primary-200 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Vendor Info */}
                    <div className="flex-shrink-0">
                      <Link to={`/vendors/${vendor._id || vendor.id}`}>
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                          {vendor.image_url ? (
                            <img
                              src={vendor.image_url.startsWith('http') ? vendor.image_url : `http://localhost:8000${vendor.image_url}`}
                              alt={vendor.business_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            to={`/vendors/${vendor._id || vendor.id}`}
                            className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {vendor.business_name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{vendor.service_category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg mb-1">
                            {getRatingStars(review.rating)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {review.comment && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <span>📍 {vendor.business_address}</span>
                        <Link
                          to={`/vendors/${vendor._id || vendor.id}`}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          View Vendor →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

