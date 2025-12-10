import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import { showSuccess, showError } from '../../utils/toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('username', email)  // OAuth2PasswordRequestForm expects 'username' field
      formData.append('password', password)

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Clear any old token data before setting new auth
      console.log('[LOGIN] Setting new auth token')
      setAuth(response.data.user, response.data.access_token)
      
      // Wait a moment for sessionStorage to be updated
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Verify token was stored
      const storedToken = useAuthStore.getState().token
      if (storedToken) {
        console.log('[LOGIN] Token stored successfully:', storedToken.substring(0, 20) + '...')
      } else {
        console.error('[LOGIN] Token was not stored!')
      }

      showSuccess(`Welcome back, ${response.data.user.full_name}!`)

      // Redirect based on role - use window.location for immediate redirect
      setTimeout(() => {
        if (response.data.user.role === 'vendor') {
          window.location.href = '/vendor/dashboard'
        } else if (response.data.user.role === 'admin') {
          window.location.href = '/admin/dashboard'
        } else {
          window.location.href = '/dashboard'
        }
      }, 1000)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      showError(errorMsg)
      setError(errorMsg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border-2 border-rose-100 hover:border-primary-200 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Welcome Back!</h2>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all duration-300 hover:border-primary-400 text-sm sm:text-base"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 font-medium text-sm sm:text-base">Password</label>
              <Link to="/forgot-password" className="text-xs sm:text-sm bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent font-semibold hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 transition-all duration-300">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all duration-300 hover:border-primary-400 text-sm sm:text-base"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-600/50 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent font-semibold hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 transition-all duration-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

