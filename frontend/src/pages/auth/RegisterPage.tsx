import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { showSuccess, showError, showWarning } from '../../utils/toast'
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter'

// Email validation function
const validateEmail = (email: string): { isValid: boolean; error: string } => {
  // Remove spaces
  email = email.trim()
  
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  // Check for double dots
  if (email.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots' }
  }
  
  // Check for spaces
  if (email.includes(' ')) {
    return { isValid: false, error: 'Email cannot contain spaces' }
  }
  
  // Check domain part
  const [localPart, domainPart] = email.split('@')
  
  // Validate local part (before @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Email must have content before @' }
  }
  
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email cannot start or end with a dot' }
  }
  
  // Validate domain part (after @)
  if (!domainPart || domainPart.length === 0) {
    return { isValid: false, error: 'Email must have a valid domain' }
  }
  
  // Check for multiple @ symbols
  if (email.split('@').length > 2) {
    return { isValid: false, error: 'Email can only contain one @ symbol' }
  }
  
  // Check for double extensions (e.g., .com.com)
  const domainParts = domainPart.split('.')
  const extensions = domainParts.slice(1) // Get all parts after the domain name
  const uniqueExtensions = new Set(extensions)
  
  if (extensions.length !== uniqueExtensions.size) {
    return { isValid: false, error: 'Email has duplicate extensions (e.g., .com.com)' }
  }
  
  // Check for valid TLD (top-level domain)
  const tld = domainParts[domainParts.length - 1]
  if (tld.length < 2) {
    return { isValid: false, error: 'Email must have a valid domain extension' }
  }
  
  // Check if domain has at least one dot
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Email must have a valid domain (e.g., example.com)' }
  }
  
  return { isValid: true, error: '' }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'user' // user, vendor, or admin
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [emailError, setEmailError] = useState('')
  const navigate = useNavigate()

  const checkEmail = async (email: string) => {
    if (!email) return
    
    // First validate email format
    const validation = validateEmail(email)
    if (!validation.isValid) {
      setEmailError(validation.error)
      setError(validation.error)
      return
    }
    
    setEmailError('')

    try {
      const response = await api.post('/auth/check-email', { email })
      if (response.data.exists) {
        setError('This email is already registered. Please login instead.')
        setEmailError('This email is already registered')
      } else {
        setError('')
        setEmailError('')
      }
    } catch (err) {
      console.error('Error checking email:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')

    if (!formData.full_name || !formData.email || !formData.password) {
      showWarning('Please fill in all required fields')
      return
    }
    
    // Validate email format
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      showError(emailValidation.error)
      setEmailError(emailValidation.error)
      setError(emailValidation.error)
      return
    }

    if (formData.password !== formData.confirm_password) {
      showError('Passwords do not match')
      return
    }

    // Check email one last time before submitting
    try {
      const checkResponse = await api.post('/auth/check-email', { email: formData.email })
      if (checkResponse.data.exists) {
        showError('This email is already registered. Please login instead.')
        setEmailError('This email is already registered')
        return
      }
    } catch (err) {
      // Ignore error here and proceed with registration attempt
    }

    setIsSubmitting(true)
    try {
      await api.post('/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: formData.role
      })

      // Show success message based on role
      if (formData.role === 'admin') {
        showSuccess('Admin registration submitted! Your request is pending approval.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
        return
      }
      
      showSuccess('Account created successfully! You can now login.')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Registration failed'
      showError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Create New Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                setEmailError('')
                setError('')
              }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-primary-600 focus:border-transparent'
              }`}
              placeholder="Enter your email"
              required
              onBlur={(e) => checkEmail(e.target.value)}
            />
            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Sign Up As</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  formData.role === 'user'
                    ? 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  formData.role === 'admin'
                    ? 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.role === 'user' 
                ? 'Sign up as a regular user to book vendors for your wedding'
                : 'Sign up as an admin to manage the platform'}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
              placeholder="Create a password"
              required
            />
            <PasswordStrengthMeter 
              password={formData.password}
              onStrengthChange={setIsPasswordValid}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Confirm Password</label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm sm:text-base"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center space-y-2">
          <p className="text-gray-600 text-xs sm:text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D72626] font-semibold hover:text-red-700 transition-colors">
              Login
            </Link>
          </p>
          <p className="text-gray-600 text-xs sm:text-sm">
            Are you a vendor?{' '}
            <Link to="/vendor/register" className="text-[#D72626] font-semibold hover:text-red-700 transition-colors">
              Vendor Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

