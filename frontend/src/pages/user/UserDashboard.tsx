import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

interface DashboardStats {
  bookings: number
  favorites: number
  budget: string
  reviews: number
}

export default function UserDashboard() {
  const user = useAuthStore((state) => state.user)
  const userName = user?.full_name?.split(' ')[0] || 'User'
  const [stats, setStats] = useState<DashboardStats>({
    bookings: 0,
    favorites: 0,
    budget: 'Rs. 0',
    reviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch bookings
      try {
        const bookingsRes = await api.get('/bookings')
        const bookings = bookingsRes.data || []
        setStats(prev => ({ ...prev, bookings: bookings.length }))
      } catch (err) {
        console.log('No bookings found')
      }

      // Fetch favorites (if endpoint exists)
      try {
        const favoritesRes = await api.get('/favorites')
        const favorites = favoritesRes.data || []
        setStats(prev => ({ ...prev, favorites: favorites.length }))
      } catch (err) {
        console.log('No favorites found')
      }

      // Budget would come from budget planner - for now use placeholder
      setStats(prev => ({ ...prev, budget: 'Rs. 500K' }))

      // Reviews count
      try {
        const reviewsRes = await api.get('/reviews/user')
        const reviews = reviewsRes.data || []
        setStats(prev => ({ ...prev, reviews: reviews.length }))
      } catch (err) {
        console.log('No reviews found')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-pink-50/30 via-white to-pink-50/20 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}! 👋
          </h1>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* My Bookings Card */}
            <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">My Bookings</h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">{stats.bookings}</div>
              <p className="text-gray-600 text-sm font-semibold">Active bookings</p>
            </div>

            {/* Favorites Card */}
            <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Favorites</h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">{stats.favorites}</div>
              <p className="text-gray-600 text-sm font-semibold">Saved vendors</p>
            </div>

            {/* Budget Card */}
            <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Budget</h3>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">{stats.budget}</div>
              <p className="text-gray-600 text-sm font-semibold">Total budget</p>
            </div>

            {/* Reviews Card */}
            <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reviews</h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">{stats.reviews}</div>
              <p className="text-gray-600 text-sm font-semibold">Pending reviews</p>
            </div>
          </div>
        )}

        {/* Quick Actions Section - Redesigned */}
        <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl p-8 border-2 border-pink-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/vendors"
              className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 transition-all hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">Find Vendors</h3>
              <p className="text-sm text-gray-600">Browse wedding vendors</p>
            </Link>

            <Link
              to="/bookings/history"
              className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">View Bookings</h3>
              <p className="text-sm text-gray-600">Check your bookings</p>
            </Link>

            <Link
              to="/budget-planner"
              className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Budget Planner</h3>
              <p className="text-sm text-gray-600">Plan your expenses</p>
            </Link>

            <Link
              to="/checklist"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl transform hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Checklist</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
