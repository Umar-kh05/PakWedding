import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function VendorDashboard() {
  const { user, logout } = useAuthStore()

  // Sample data - replace with API calls
  const stats = {
    totalBookings: 45,
    pendingRequests: 8,
    averageRating: 4.9,
    totalRevenue: 'Rs. 2.5M'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Requests</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Average Rating</p>
            <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/vendor/profile"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Manage Profile
            </Link>
            <Link
              to="/vendor/bookings"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              View Bookings
            </Link>
            <Link
              to="/vendor/packages"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Manage Packages
            </Link>
            <Link
              to="/vendor/reviews"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              View Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
