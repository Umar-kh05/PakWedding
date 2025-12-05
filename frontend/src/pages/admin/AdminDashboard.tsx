import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function AdminDashboard() {
  const { logout } = useAuthStore()

  // Sample data - replace with API calls
  const stats = {
    pendingApprovals: 5,
    flaggedReviews: 12,
    activeUsers: 1234
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Vendor Approvals</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Flagged Reviews</p>
            <p className="text-3xl font-bold text-gray-900">{stats.flaggedReviews}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Active Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/vendors/add"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Vendor
            </Link>
            <Link
              to="/admin/vendors"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Vendor Approvals
            </Link>
            <Link
              to="/admin/users"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              User Management
            </Link>
            <Link
              to="/admin/reviews"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Review Moderation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
