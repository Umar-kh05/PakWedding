import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'
import api from '../../services/api'

interface DashboardStats {
  pendingApprovals: number
  pendingAdminApprovals?: number
  flaggedReviews: number
  activeUsers: number
}

export default function AdminDashboard() {
  const { logout, user, token } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    pendingAdminApprovals: 0,
    flaggedReviews: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Get fresh state from store (may be more up-to-date than component state)
    const authState = useAuthStore.getState()
    const currentToken = authState.token
    const currentUser = authState.user
    
    console.log('[ADMIN DASHBOARD] Mounting - Token:', currentToken ? 'Present' : 'Missing', 'User:', currentUser?.role)
    
    // Check if user is authenticated and is admin before loading stats
    if (!currentToken || !currentUser || currentUser.role !== 'admin') {
      console.error('[ADMIN DASHBOARD] Not authenticated or not admin - Token:', !!currentToken, 'User:', currentUser?.role)
      // Only redirect once if we're sure there's no token
      if (!currentToken && !isRedirecting) {
        console.error('[ADMIN DASHBOARD] Redirecting to login...')
        setIsRedirecting(true)
        logout()
        window.location.href = '/admin/login'
      }
      return
    }
    
    // Load stats immediately if authenticated
    console.log('[ADMIN DASHBOARD] Authenticated, loading stats...')
    loadStats()
    
    const onFocus = () => {
      const freshState = useAuthStore.getState()
      if (freshState.token && freshState.user && freshState.user.role === 'admin') {
        loadStats()
      }
    }
    window.addEventListener('focus', onFocus)
    
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, []) // Empty dependency array - only run on mount

  const loadStats = async () => {
    // Get fresh token from store
    const authState = useAuthStore.getState()
    const currentToken = authState.token
    const currentUser = authState.user
    
    if (!currentToken) {
      console.error('[ADMIN DASHBOARD] No token available for API call')
      return
    }
    
    if (!currentUser || currentUser.role !== 'admin') {
      console.error('[ADMIN DASHBOARD] User is not admin')
      return
    }
    
    try {
      setLoading(true)
      console.log('[ADMIN DASHBOARD] Loading stats with token:', currentToken.substring(0, 20) + '...')
      const { data } = await api.get<DashboardStats>('/admin/stats')
      console.log('[ADMIN DASHBOARD] Stats loaded successfully:', data)
      setStats(data)
    } catch (error: any) {
      console.error('[ADMIN DASHBOARD] Error loading stats:', error)
      console.error('[ADMIN DASHBOARD] Error status:', error.response?.status)
      console.error('[ADMIN DASHBOARD] Error message:', error.response?.data)
      
      // Only redirect on 401 if we're sure the token is invalid
      if (error.response?.status === 401) {
        console.error('[ADMIN DASHBOARD] 401 Unauthorized - redirecting to login')
        logout()
        window.location.href = '/admin/login'
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-amber-50/60 to-white shadow-lg border-b-2 border-primary-100">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base font-medium">Manage your platform</p>
          </div>
          <button
            onClick={loadStats}
            className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh stats'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-6 border-2 border-primary-100 hover:border-primary-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Pending Vendor Approvals</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{stats.pendingApprovals}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-6 border-2 border-primary-100 hover:border-primary-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Pending Admin Approvals</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{stats.pendingAdminApprovals || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-6 border-2 border-primary-100 hover:border-primary-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚩</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Flagged Reviews</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{stats.flaggedReviews}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-6 border-2 border-primary-100 hover:border-primary-300 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Active Users</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{stats.activeUsers.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Cards - Redesigned */}
        <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl shadow-xl p-8 border-2 border-primary-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link
              to="/admin/vendors/add"
              className="group bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border-2 border-primary-200 hover:border-primary-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">Add New Vendor</h3>
              <p className="text-sm text-gray-600">Create a new vendor account</p>
            </Link>
            <Link
              to="/admin/vendors"
              className="group bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border-2 border-primary-200 hover:border-primary-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">Vendor Approvals</h3>
              <p className="text-sm text-gray-600">Review and approve vendors</p>
            </Link>
            <Link
              to="/admin/users"
              className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">User Management</h3>
              <p className="text-sm text-gray-600">Manage all platform users</p>
            </Link>
            <Link
              to="/admin/reviews"
              className="group bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border-2 border-primary-200 hover:border-primary-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">Review Moderation</h3>
              <p className="text-sm text-gray-600">Moderate user reviews</p>
            </Link>
            <Link
              to="/admin/admin-approvals"
              className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">Admin Approvals</h3>
              <p className="text-sm text-gray-600">Approve new admin requests</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
