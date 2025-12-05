import { useEffect, useState } from 'react'
import { getVendorBookings, approveBooking, rejectBooking, Booking } from '../../services/bookingService'
import { useAuthStore } from '../../store/authStore'

export default function VendorBookingsPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [statusFilter, user])

  const loadBookings = async () => {
    if (!user) {
      setError('Please login as a vendor to view bookings')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      console.log('Loading vendor bookings with filter:', statusFilter || 'none')
      const data = await getVendorBookings(statusFilter || undefined)
      console.log('Loaded bookings:', data)
      setBookings(data)
    } catch (err: any) {
      console.error('Error loading bookings:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load bookings'
      setError(errorMessage)
      
      // If it's a connection error, provide helpful message
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('ECONNRESET')) {
        setError('Cannot connect to server. Please make sure the backend server is running on http://localhost:8000')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: string) => {
    if (!confirm('Are you sure you want to approve this booking?')) return

    try {
      await approveBooking(bookingId)
      await loadBookings()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to approve booking')
    }
  }

  const handleReject = async (bookingId: string) => {
    if (!confirm('Are you sure you want to reject this booking?')) return

    try {
      await rejectBooking(bookingId)
      await loadBookings()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to reject booking')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id || booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Booking ID: {booking.id || booking._id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Event Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(booking.event_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{booking.event_location}</p>
                      </div>
                      {booking.guest_count && (
                        <div>
                          <p className="text-sm text-gray-600">Guest Count</p>
                          <p className="font-semibold text-gray-900">{booking.guest_count}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-semibold text-gray-900">Rs. {booking.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    {booking.special_requirements && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Special Requirements</p>
                        <p className="text-gray-900">{booking.special_requirements}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(booking.id || booking._id || '')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(booking.id || booking._id || '')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

