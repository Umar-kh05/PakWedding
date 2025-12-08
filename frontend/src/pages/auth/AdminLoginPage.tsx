import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter both email and password')
        setLoading(false)
        return
      }

      console.log('Attempting login with email:', email)
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const apiUrl = api.defaults.baseURL || 'http://localhost:8000/api'
      console.log('Sending login request to:', apiUrl + '/auth/login')
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000 // 10 seconds timeout
      })
      console.log('Login response:', response.data)

      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.')
        setLoading(false)
        return
      }

      // For now, 2FA is optional - can be implemented later
      if (twoFactorCode && twoFactorCode.length < 6) {
        setError('Invalid 2FA code')
        setLoading(false)
        return
      }

      // Set auth and verify token is stored
      console.log('[ADMIN LOGIN] Setting auth with user:', response.data.user.email, 'Role:', response.data.user.role)
      console.log('[ADMIN LOGIN] Token received:', response.data.access_token.substring(0, 20) + '...')
      
      setAuth(response.data.user, response.data.access_token)
      
      // Wait for zustand persist to save to localStorage
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Verify token was stored before navigating
      const storedToken = useAuthStore.getState().token
      const storedUser = useAuthStore.getState().user
      
      console.log('[ADMIN LOGIN] After setAuth - Token in store:', storedToken ? storedToken.substring(0, 20) + '...' : 'MISSING')
      console.log('[ADMIN LOGIN] After setAuth - User in store:', storedUser ? `${storedUser.email} (${storedUser.role})` : 'MISSING')
      
      // Also check localStorage directly
      const lsData = localStorage.getItem('auth-storage')
      console.log('[ADMIN LOGIN] LocalStorage content:', lsData ? 'Present' : 'Missing')
      
      if (!storedToken) {
        console.error('[ADMIN LOGIN] Token was not stored!')
        setError('Failed to save authentication. Please try again.')
        setLoading(false)
        return
      }
      
      if (!storedUser || storedUser.role !== 'admin') {
        console.error('[ADMIN LOGIN] User was not stored correctly!')
        setError('Failed to save user data. Please try again.')
        setLoading(false)
        return
      }
      
      console.log('[ADMIN LOGIN] ✓ Token and user stored successfully, navigating to dashboard')
      navigate('/admin/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      let errorMessage = 'Login failed. Please check your credentials and try again.'
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check if the backend server is running on http://localhost:8000'
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on http://localhost:8000'
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Admin Access</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">2FA Code (Optional)</label>
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter 2FA code"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Enter Admin Portal'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-[#D72626] hover:text-red-700 transition-colors font-semibold">
            Back to User Login
          </Link>
        </div>
      </div>
    </div>
  )
}


