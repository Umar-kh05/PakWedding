import { useState, useEffect } from 'react'
import api from '../../services/api'

interface Vendor {
  _id: string
  business_name: string
  service_category: string
  email: string
  phone_number: string
  business_address: string
  status: string
}

export default function VendorApprovalsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    loadVendors()
  }, [filter])

  const loadVendors = async () => {
    try {
      setLoading(true)
      // This would be an actual API call
      // const response = await api.get('/admin/vendors', { params: { status: filter } })
      // setVendors(response.data)
      
      // Mock data for now
      setVendors([
        {
          _id: '1',
          business_name: 'Elite Photography Studio',
          service_category: 'Photography',
          email: 'elite@example.com',
          phone_number: '+92 300 1234567',
          business_address: 'Lahore, Pakistan',
          status: 'pending'
        },
        {
          _id: '2',
          business_name: 'Royal Caterers',
          service_category: 'Catering',
          email: 'royal@example.com',
          phone_number: '+92 321 9876543',
          business_address: 'Karachi, Pakistan',
          status: 'pending'
        }
      ])
    } catch (error) {
      console.error('Error loading vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId: string) => {
    try {
      // await api.post(`/admin/vendors/${vendorId}/approve`)
      alert('Vendor approved successfully!')
      loadVendors()
    } catch (error) {
      alert('Failed to approve vendor')
    }
  }

  const handleReject = async (vendorId: string) => {
    try {
      // await api.post(`/admin/vendors/${vendorId}/reject`)
      alert('Vendor rejected')
      loadVendors()
    } catch (error) {
      alert('Failed to reject vendor')
    }
  }

  const filteredVendors = filter === 'all' 
    ? vendors 
    : vendors.filter(v => v.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/30 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-white via-pink-50/50 to-white rounded-2xl shadow-xl p-8 border-2 border-pink-100 mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-2">
            Vendor Approvals
          </h1>
          <p className="text-gray-600 font-medium">Review and approve vendor registrations</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-pink-100">
          <div className="flex gap-4">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

        {/* Vendors List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-pink-100">
            <p className="text-gray-600 text-lg">No vendors found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg p-6 border-2 border-pink-100 hover:border-pink-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.business_name}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Category:</span> {vendor.service_category}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {vendor.email}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span> {vendor.phone_number}
                      </div>
                      <div>
                        <span className="font-semibold">Address:</span> {vendor.business_address}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vendor.status === 'approved' ? 'bg-green-100 text-green-700' :
                        vendor.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </div>
                  </div>
                  {vendor.status === 'pending' && (
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(vendor._id)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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

