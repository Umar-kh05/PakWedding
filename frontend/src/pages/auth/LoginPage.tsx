import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const formData = new FormData()
      formData.append('username', email)  // OAuth2PasswordRequestForm expects 'username' field
      formData.append('password', password)

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setAuth(response.data.user, response.data.access_token)

      // Redirect based on role
      if (response.data.user.role === 'vendor') {
        navigate('/vendor/dashboard')
      } else if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome Back!</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 font-medium">Password</label>
              <Link to="/forgot-password" className="text-sm bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold hover:from-pink-700 hover:to-purple-700">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-3">OR</p>
            <div className="flex flex-col gap-2">
              <Link
                to="/vendor/register"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-center text-sm transition-colors"
              >
                Login as Vendor
              </Link>
              <Link
                to="/admin/login"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-center text-sm transition-colors"
              >
                Login as Admin
              </Link>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-semibold hover:from-pink-700 hover:to-purple-700">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

