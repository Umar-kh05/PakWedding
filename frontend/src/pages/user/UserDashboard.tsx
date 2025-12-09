import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

interface DashboardStats {
  bookings: number
  favorites: number
  budget: string
  reviews: number
}

export default function UserDashboard() {
  const user = useAuthStore((state) => state.user)
  const userName = user?.full_name?.split(' ')[0] || 'User'

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/vendors', label: 'Find Vendors', icon: '🔍' },
    { path: '/bookings/history', label: 'My Bookings', icon: '📅' },
    { path: '/budget-planner', label: 'Budget Planner', icon: '💰' },
    { path: '/checklist', label: 'Checklist', icon: '✅' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/reviews', label: 'My Reviews', icon: '⭐' },
  ]
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
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="User Dashboard" />
      
      <div className="flex-1 flex flex-col">
        {/* Modern Elegant Header */}
        <div className="bg-gradient-to-r from-white via-amber-50/60 to-white shadow-md border-b-2 border-primary-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] bg-clip-text text-transparent">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1">Let's plan your perfect wedding</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-6 sm:py-8 md:py-10 px-4 sm:px-6 overflow-y-auto">
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
              className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-accent-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-600 to-accent-500 rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">❤️</span>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-accent-600">{stats.favorites}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Favorites</h3>
              <p className="text-gray-600 text-sm">Saved vendors</p>
            </Link>

            {/* Budget Card */}
            <div className="group bg-white rounded-2xl shadow-lg p-6 border-l-4 border-accent-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-600 to-primary-600 rounded-xl group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-accent-600">{stats.budget}</div>
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

          </div>
        </div>
      </div>
    </div>
  )
}
