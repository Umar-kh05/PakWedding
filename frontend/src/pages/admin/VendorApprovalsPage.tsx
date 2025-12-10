import { useState, useEffect } from 'react'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

interface Vendor {
  id: string
  _id?: string
  business_name: string
  service_category: string
  email: string
  phone_number: string
  business_address: string
  contact_person: string
  description?: string
  image_url?: string
  is_approved: boolean
  is_active: boolean
  rating?: number
  total_bookings?: number
  created_at?: string
}

export default function VendorApprovalsPage() {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]) // Store all vendors for counts
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/vendors', label: 'Vendor Approvals', icon: '✅' },
    { path: '/admin/vendors/add', label: 'Add Vendor', icon: '➕' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/reviews', label: 'Review Moderation', icon: '⭐' },
    { path: '/admin/admin-approvals', label: 'Admin Approvals', icon: '🔐' },
  ]

  useEffect(() => {
    loadVendors()
  }, [])

  // Reload vendors when filter changes or after approve/reject
  const loadVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Always load ALL vendors to calculate accurate counts
      const { data } = await api.get<Vendor[]>('/admin/vendors', { 
        params: { limit: 1000 } 
      })
      setAllVendors(data || [])
    } catch (err: any) {
      console.error('Error loading vendors:', err)
      setError(err.response?.data?.detail || 'Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId: string) => {
    try {
      setError(null)
      setSuccess(null)
      await api.post(`/admin/vendors/${vendorId}/approve`)
      setSuccess('Vendor approved successfully!')
      loadVendors()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error approving vendor:', err)
      setError(err.response?.data?.detail || 'Failed to approve vendor')
    }
  }

  const handleReject = async (vendorId: string) => {
    if (!confirm('Are you sure you want to reject this vendor? This action cannot be undone.')) {
      return
    }
    
    try {
      setError(null)
      setSuccess(null)
      await api.post(`/admin/vendors/${vendorId}/reject`)
      setSuccess('Vendor rejected')
      loadVendors()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error rejecting vendor:', err)
      setError(err.response?.data?.detail || 'Failed to reject vendor')
    }
  }

  const getVendorStatus = (vendor: Vendor): string => {
    if (!vendor.is_approved && vendor.is_active) {
      return 'pending'
    } else if (vendor.is_approved && vendor.is_active) {
      return 'approved'
    } else {
      return 'rejected'
    }
  }

  // Filter vendors based on selected filter
  const filteredVendors = filter === 'all' 
    ? allVendors 
    : allVendors.filter(v => getVendorStatus(v) === filter)

  // Calculate counts from all vendors
  const counts = {
    all: allVendors.length,
    pending: allVendors.filter(v => getVendorStatus(v) === 'pending').length,
    approved: allVendors.filter(v => getVendorStatus(v) === 'approved').length,
    rejected: allVendors.filter(v => getVendorStatus(v) === 'rejected').length,
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="Admin Dashboard" />
      <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0">
        <div className="py-6 sm:py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-2 text-left">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[#D72626] hover:text-[#F26D46] font-semibold transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent leading-normal">
            Vendor Approvals
          </h1>
          <p className="text-base text-gray-700 font-medium">Review and approve vendor registrations</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-primary-100">
          <div className="flex gap-4 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all capitalize ${
                  filter === status
                    ? 'bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white shadow-lg'
                    : 'bg-primary-50 text-gray-700 hover:bg-primary-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Vendors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-primary-100">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5zM9 10a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <p className="text-gray-600 text-lg font-semibold">No {filter === 'all' ? '' : filter} vendors found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'pending' && 'All vendors have been reviewed'}
              {filter === 'approved' && 'No approved vendors yet'}
              {filter === 'rejected' && 'No rejected vendors'}
              {filter === 'all' && 'No vendors in the system'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVendors.map((vendor) => {
              const status = getVendorStatus(vendor)
              return (
                <div
                  key={vendor.id || vendor._id}
                  className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl shadow-lg p-6 border-2 border-primary-100 hover:border-primary-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        {vendor.image_url && (
                          <img
                            src={vendor.image_url}
                            alt={vendor.business_name}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.business_name}</h3>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                              {vendor.service_category}
                            </span>
                            {vendor.rating && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm text-gray-600">{vendor.rating.toFixed(1)}</span>
                              </div>
                            )}
                            {vendor.total_bookings !== undefined && (
                              <span className="text-sm text-gray-600">
                                {vendor.total_bookings} bookings
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-semibold text-gray-700">Contact Person:</span> {vendor.contact_person}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Email:</span> {vendor.email}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Phone:</span> {vendor.phone_number}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Address:</span> {vendor.business_address}
                        </div>
                        {vendor.created_at && (
                          <div>
                            <span className="font-semibold text-gray-700">Registered:</span>{' '}
                            {new Date(vendor.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                      
                      {vendor.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
                      )}
                      
                      <div className="mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === 'approved' ? 'bg-green-100 text-green-700' :
                          status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                    
                    {status === 'pending' && (
                      <div className="flex flex-col gap-3 min-w-[140px]">
                        <button
                          onClick={() => handleApprove(vendor.id || vendor._id || '')}
                          className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id || vendor._id || '')}
                          className="bg-white border border-gray-200 text-gray-800 hover:border-primary-300 hover:bg-primary-50 px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {status === 'approved' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Approved</span>
                      </div>
                    )}
                    
                    {status === 'rejected' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
