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
        const bookingsRes = await api.get('/bookings/my-bookings')
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      {/* Modern Elegant Header */}
      <div className="bg-white border-b-4 border-[#D72626] shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D72626] to-[#F26D46] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">👋</span>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-gray-600 text-lg mt-1">Let's plan your perfect wedding</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#FFF7F1] to-[#FEECEC] rounded-2xl px-8 py-5 border-2 border-[#F26D46]/30 shadow-md">
              <p className="text-sm text-[#D72626] mb-1 font-semibold">Wedding Date</p>
              <p className="text-2xl font-bold text-gray-900">Coming Soon 🎉</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-10 px-4">
        <div className="container mx-auto max-w-7xl">

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
            <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#D72626] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#D72626] to-[#F26D46] rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-[#D72626]">{stats.bookings}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">My Bookings</h3>
              <p className="text-gray-600 text-sm">Active bookings</p>
            </div>

            {/* Favorites Card */}
            <Link
              to="/favorites"
              className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#F7A76C] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#F26D46] to-[#F7A76C] rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">❤️</span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-[#F26D46]">{stats.favorites}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Favorites</h3>
              <p className="text-gray-600 text-sm">Saved vendors</p>
            </Link>

            {/* Budget Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#F6A423] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#F7A76C] to-[#F6A423] rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-[#F6A423]">{stats.budget}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Budget</h3>
              <p className="text-gray-600 text-sm">Total budget</p>
            </div>

            {/* Reviews Card */}
            <Link
              to="/reviews"
              className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#D72626] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#D72626] to-[#F26D46] rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">⭐</span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-[#D72626]">{stats.reviews}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Reviews</h3>
              <p className="text-gray-600 text-sm">Your reviews</p>
            </Link>
          </div>
        )}

        {/* Quick Actions Section - Redesigned */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-red-600">⚡</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/vendors"
              className="group bg-gradient-to-br from-[#FFF7F1] to-[#FEECEC] rounded-xl p-6 border border-[#D72626]/20 hover:border-[#D72626] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#D72626] to-[#F26D46] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#D72626] transition-colors">Find Vendors</h3>
              <p className="text-sm text-gray-600">Browse wedding vendors</p>
            </Link>

            <Link
              to="/bookings/history"
              className="group bg-gradient-to-br from-[#FFF7F1] to-[#FEECEC] rounded-xl p-6 border border-[#F26D46]/20 hover:border-[#F26D46] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#F26D46] to-[#F7A76C] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#F26D46] transition-colors">View Bookings</h3>
              <p className="text-sm text-gray-600">Check your bookings</p>
            </Link>

            <Link
              to="/budget-planner"
              className="group bg-gradient-to-br from-[#FFF7F1] to-[#FEECEC] rounded-xl p-6 border border-[#F7A76C]/20 hover:border-[#F7A76C] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#F7A76C] to-[#F6A423] rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#F6A423] transition-colors">Budget Planner</h3>
              <p className="text-sm text-gray-600">Plan your expenses</p>
            </Link>

            <Link
              to="/checklist"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-md">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Checklist</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
