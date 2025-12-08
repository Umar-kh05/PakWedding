import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Review {
  id: string
  _id?: string
  user_id: string
  vendor_id: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
  vendor_name?: string
}

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low_rated'>('all')

  useEffect(() => {
    loadReviews()
  }, [filter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/reviews')
      setReviews(response.data)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      await api.delete(`/admin/reviews/${reviewId}`)
      alert('Review deleted')
      loadReviews()
    } catch (error) {
      alert('Failed to delete review')
    }
  }

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(r => r.rating < 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-white via-pink-50/50 to-white rounded-2xl shadow-xl p-8 border-2 border-pink-100 mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-2">
            Review Moderation
          </h1>
          <p className="text-gray-600 font-medium">Moderate and manage user reviews</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-pink-100">
          <div className="flex gap-4">
            {(['all', 'low_rated'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all capitalize ${filter === status
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                  }`}
              >
                {status === 'low_rated' ? 'Low Rated (< 3 stars)' : 'All Reviews'}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-pink-100">
            <p className="text-gray-600 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id || review._id}
                className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg p-6 border-2 border-pink-100 hover:border-pink-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <h3 className="font-bold text-gray-900">
                        {review.user_name || `User ${review.user_id.substring(0, 8)}...`}
                      </h3>
                      <span className="text-gray-500">reviewed</span>
                      <span className="font-semibold text-pink-600">
                        {review.vendor_name || `Vendor ${review.vendor_id.substring(0, 8)}...`}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating}/5</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {review.comment}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Reviewed on: {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${review.rating < 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {review.rating < 3 ? 'Low Rating' : 'Good Rating'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-6">
                    <button
                      onClick={() => handleDelete(review.id || review._id || '')}
                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
