import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

interface Booking {
  _id: string
  vendor_id: string
  vendor_name?: string
  event_date: string
  event_type: string
  guest_count: number
  status: string
  total_amount?: number
  created_at: string
}

export default function BookingHistoryPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    loadBookings()
  }, [filter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/bookings')
      let allBookings = response.data || []
      
      // Filter by status if needed
      if (filter !== 'all') {
        allBookings = allBookings.filter((b: Booking) => b.status === filter)
      }
      
      setBookings(allBookings)
    } catch (error: any) {
      console.error('Error loading bookings:', error)
      // If API fails, show empty state
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-PK', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/30 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white via-pink-50/50 to-white rounded-2xl shadow-xl p-8 border-2 border-pink-100 mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-2">
            Booking History
          </h1>
          <p className="text-gray-600 font-medium">View and manage all your bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-pink-100">
          <div className="flex gap-4 flex-wrap">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all capitalize ${
                  filter === status
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-pink-100">
            <p className="text-gray-600 text-lg">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-xl p-12 text-center border-2 border-pink-100">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">Start booking vendors for your wedding!</p>
            <Link
              to="/vendors"
              className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg p-6 border-2 border-pink-100 hover:border-pink-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.vendor_name || 'Vendor'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-700">Event Date:</span> {formatDate(booking.event_date)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Event Type:</span> {booking.event_type}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Guests:</span> {booking.guest_count}
                      </div>
                      {booking.total_amount && (
                        <div>
                          <span className="font-semibold text-gray-700">Amount:</span> Rs. {booking.total_amount.toLocaleString()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-gray-700">Booked:</span> {formatDate(booking.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/vendors/${booking.vendor_id}`}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      View Vendor
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
