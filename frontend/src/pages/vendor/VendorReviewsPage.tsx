import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

type Review = {
  id: string
  user_id: string
  vendor_id: string
  booking_id?: string
  rating: number
  comment?: string
  user_name?: string
  created_at: string
}

export default function VendorReviewsPage() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  const sidebarItems = [
    { path: '/vendor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/vendor/bookings', label: 'Bookings', icon: '📅' },
    { path: '/vendor/profile', label: 'Profile', icon: '👤' },
    { path: '/vendor/packages', label: 'Packages', icon: '📦' },
    { path: '/vendor/reviews', label: 'Reviews', icon: '⭐' },
  ]

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading vendor reviews...')
      const { data } = await api.get<Review[]>('/reviews/vendor/me')
      console.log('Reviews received:', data)
      setReviews(data || [])
      
      // Calculate stats
      if (data && data.length > 0) {
        const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        data.forEach(r => {
          const rating = Math.round(r.rating)
          if (rating >= 1 && rating <= 5) {
            distribution[rating as keyof typeof distribution]++
          }
        })
        
        setStats({
          averageRating: avgRating,
          totalReviews: data.length,
          ratingDistribution: distribution
        })
      } else {
        // Reset stats if no reviews
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        })
      }
    } catch (err: any) {
      console.error('Error loading reviews:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load reviews'
      setError(errorMessage)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-[#D72626] mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="Vendor Dashboard" />
      <div className="ml-64 flex flex-col overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="text-[#D72626] hover:text-red-700 font-semibold mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-orange-600 bg-clip-text text-transparent">
            Customer Reviews
          </h1>
          <p className="text-gray-600 mt-2">See what your customers are saying</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Summary */}
        {stats.totalReviews > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-rose-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Average Rating</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-rose-600 bg-clip-text text-transparent">{stats.averageRating.toFixed(1)}</span>
                  <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Total Reviews</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-orange-600 bg-clip-text text-transparent">{stats.totalReviews}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">5-Star Reviews</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">{stats.ratingDistribution[5]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Reviews from your customers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#D72626] hover:border-[#D72626] hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D72626] to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {review.user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{review.user_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-gray-600 font-semibold">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

