import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifyingToken, setVerifyingToken] = useState(true)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      // Verify token immediately
      verifyToken(tokenParam)
    } else {
      setError('Invalid reset link. Please request a new password reset.')
      setVerifyingToken(false)
    }
  }, [searchParams])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await api.post('/auth/verify-reset-token', {
        token: tokenToVerify
      })

      if (!response.data.valid) {
        const reason = response.data.reason || 'Invalid token'
        if (reason.includes('expired')) {
          setError('This reset link has expired. Please request a new password reset.')
        } else if (reason.includes('not found')) {
          setError('Invalid reset link. Please request a new password reset.')
        } else {
          setError(`Reset link is invalid: ${reason}`)
        }
      }
    } catch (err: any) {
      console.error('Token verification error:', err)
      setError('Unable to verify reset link. Please try again.')
    } finally {
      setVerifyingToken(false)
    }
  }


  const validatePasswordStrength = (pwd: string) => {
    const errors = []
    if (pwd.length < 8) errors.push('At least 8 characters')
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter')
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter')
    if (!/\d/.test(pwd)) errors.push('One number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('One special character')
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate password strength
    const passwordErrors = validatePasswordStrength(password)
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`)
      toast.error('Password is too weak')
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: password
      })
      setSuccess(true)
      toast.success('Password reset successful! You can now login 🎉')

      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to reset password'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login page...
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-[#D72626] to-red-600 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D72626] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Reset Link</h2>
            <p className="text-gray-600">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm mb-2">{error}</p>
            {(error.includes('expired') || error.includes('Invalid')) && (
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#D72626] hover:text-red-700 underline"
              >
                Request a new password reset →
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D72626] focus:border-transparent"
              placeholder="Enter new password"
              required
              minLength={8}
              disabled={loading || !token}
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D72626] focus:border-transparent"
              placeholder="Confirm new password"
              required
              minLength={8}
              disabled={loading || !token}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-gradient-to-r from-[#D72626] to-red-600 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#D72626] font-semibold hover:text-red-700 transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
