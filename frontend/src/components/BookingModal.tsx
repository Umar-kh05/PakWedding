import { useState } from 'react'
import { createBooking, BookingCreate } from '../services/bookingService'
import { useAuthStore } from '../store/authStore'

interface BookingModalProps {
  vendorId: string
  vendorName: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BookingModal({ vendorId, vendorName, isOpen, onClose, onSuccess }: BookingModalProps) {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    event_date: '',
    event_location: '',
    guest_count: '',
    special_requirements: '',
    total_amount: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      setError('Please login to book a vendor')
      setLoading(false)
      return
    }

    try {
      // Check token before submitting
      const token = useAuthStore.getState().token
      const currentUser = useAuthStore.getState().user
      
      if (!token) {
        setError('Please login to book a vendor')
        setLoading(false)
        return
      }
      
      if (!currentUser) {
        setError('User session not found. Please login again.')
        setLoading(false)
        return
      }

      // Validate required fields
      if (!formData.event_date || !formData.event_location) {
        setError('Please fill in all required fields (Event Date and Location)')
        setLoading(false)
        return
      }

      // Validate total_amount - it's required and must be > 0
      const totalAmount = parseFloat(formData.total_amount)
      if (!formData.total_amount || isNaN(totalAmount) || totalAmount <= 0) {
        setError('Please enter a valid total amount greater than 0')
        setLoading(false)
        return
      }

      const bookingData: BookingCreate = {
        vendor_id: vendorId,
        event_date: new Date(formData.event_date).toISOString(),
        event_location: formData.event_location.trim(),
        guest_count: formData.guest_count ? parseInt(formData.guest_count) : undefined,
        special_requirements: formData.special_requirements?.trim() || undefined,
        total_amount: totalAmount
      }

      console.log('Creating booking with data:', bookingData)
      console.log('Token present:', !!token)
      console.log('User:', currentUser)
      
      const result = await createBooking(bookingData)
      console.log('Booking created successfully:', result)
      
      onSuccess()
      onClose()
      
      // Reset form
      setFormData({
        event_date: '',
        event_location: '',
        guest_count: '',
        special_requirements: '',
        total_amount: ''
      })
    } catch (err: any) {
      console.error('Booking creation error:', err)
      console.error('Error response:', err.response)
      
      // Handle 401 specifically
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.')
      } else if (err.response?.status === 422) {
        // Handle validation errors from FastAPI/Pydantic
        const errorData = err.response?.data
        let errorMessage = 'Validation error: '
        
        if (errorData?.detail && Array.isArray(errorData.detail)) {
          // Pydantic validation errors come as an array
          const errors = errorData.detail.map((e: any) => {
            const field = e.loc?.join('.') || 'unknown'
            return `${field}: ${e.msg}`
          }).join(', ')
          errorMessage += errors
        } else if (errorData?.detail) {
          // Single error message
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail)
        } else {
          errorMessage = 'Invalid booking data. Please check all fields are filled correctly.'
        }
        
        setError(errorMessage)
      } else {
        const errorMessage = err.response?.data?.detail 
          ? (typeof err.response.data.detail === 'string' 
              ? err.response.data.detail 
              : JSON.stringify(err.response.data.detail))
          : err.message || 'Failed to create booking'
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book {vendorName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Event Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter venue address"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Number of Guests</label>
            <input
              type="number"
              name="guest_count"
              value={formData.guest_count}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Approximate guest count"
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Total Amount (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter estimated amount"
              min="0.01"
              step="0.01"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Required field</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Special Requirements</label>
            <textarea
              name="special_requirements"
              value={formData.special_requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Any special requests or requirements..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

