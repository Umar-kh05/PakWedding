import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'
import { getVendorProfile } from '../../services/vendorService'

export default function VendorDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    averageRating: 0.0,
    totalRevenue: 'Rs. 0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const vendor = await getVendorProfile()
        setStats({
          totalBookings: vendor.total_bookings || 0,
          pendingRequests: vendor.pending_requests || 0,
          averageRating: vendor.rating || 0.0,
          totalRevenue: vendor.total_revenue 
            ? `Rs. ${(vendor.total_revenue / 1000000).toFixed(1)}M` 
            : 'Rs. 0'
        })
      } catch (err) {
        console.error('Error loading vendor stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/30 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-pink-50/50 to-white shadow-lg border-b-2 border-pink-200">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent">
              Vendor Dashboard
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Welcome back, {user?.full_name || 'Vendor'}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {loading ? '...' : stats.totalBookings}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Pending Requests</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {loading ? '...' : stats.pendingRequests}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Average Rating</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {loading ? '...' : stats.averageRating.toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl shadow-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {loading ? '...' : stats.totalRevenue}
            </p>
          </div>
        </div>

        {/* Quick Actions - Redesigned */}
        <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl p-8 border-2 border-pink-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link
              to="/vendor/profile"
              className="group bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200 hover:border-pink-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">Manage Profile</h3>
              <p className="text-sm text-gray-600">Update your business information</p>
            </Link>
            <Link
              to="/vendor/bookings"
              className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Manage Bookings</h3>
              <p className="text-sm text-gray-600">View and manage bookings</p>
            </Link>
            <Link
              to="/vendor/packages"
              className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Manage Packages</h3>
              <p className="text-sm text-gray-600">Create and edit service packages</p>
            </Link>
            <Link
              to="/vendor/reviews"
              className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 hover:border-amber-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">View Reviews</h3>
              <p className="text-sm text-gray-600">See what customers say</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
