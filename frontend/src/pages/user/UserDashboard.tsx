import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function UserDashboard() {
  const user = useAuthStore((state) => state.user)
  const userName = user?.full_name?.split(' ')[0] || 'User'

  // Sample data - replace with actual API calls
  const stats = {
    bookings: 3,
    favorites: 12,
    budget: 'Rs. 500K',
    reviews: 2
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}! 👋
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* My Bookings Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-lg mb-4 border-2 border-red-200">
              <div className="text-center">
                <div className="text-[10px] font-bold text-red-600 uppercase leading-tight">Jul</div>
                <div className="text-2xl font-bold text-red-600 leading-none">17</div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">My Bookings</h3>
            <div className="text-4xl font-bold text-red-600 mb-1">{stats.bookings}</div>
            <p className="text-gray-600 text-sm">Active bookings</p>
          </div>

          {/* Favorites Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-lg mb-4">
              <span className="text-4xl">❤️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Favorites</h3>
            <div className="text-4xl font-bold text-red-600 mb-1">{stats.favorites}</div>
            <p className="text-gray-600 text-sm">Saved vendors</p>
          </div>

          {/* Budget Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-lg mb-4">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Budget</h3>
            <div className="text-4xl font-bold text-red-600 mb-1">{stats.budget}</div>
            <p className="text-gray-600 text-sm">Total budget</p>
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-lg mb-4">
              <span className="text-4xl">⭐</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reviews</h3>
            <div className="text-4xl font-bold text-red-600 mb-1">{stats.reviews}</div>
            <p className="text-gray-600 text-sm">Pending reviews</p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/vendors"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl text-center text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Find Vendors
            </Link>

            <Link
              to="/bookings/history"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl text-center text-lg transition-all shadow-lg hover:shadow-xl"
            >
              View Bookings
            </Link>

            <Link
              to="/budget-planner"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl text-center text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Budget Planner
            </Link>

            <Link
              to="/checklist"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl text-center text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Checklist
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
