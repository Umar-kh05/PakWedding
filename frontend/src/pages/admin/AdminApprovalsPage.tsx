import { useState, useEffect } from 'react'
import api from '../../services/api'

interface AdminUser {
  id: string
  full_name: string
  email: string
  phone_number?: string
  role: string
  is_active: boolean
  is_admin_approved: boolean
  created_at: string
}

export default function AdminApprovalsPage() {
  const [pendingAdmins, setPendingAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadPendingAdmins()
  }, [])

  const loadPendingAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get<AdminUser[]>('/admin/admin-approvals')
      setPendingAdmins(data || [])
    } catch (err: any) {
      console.error('Error loading pending admins:', err)
      setError(err.response?.data?.detail || 'Failed to load pending admin approvals')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      setError(null)
      setSuccess(null)
      await api.post(`/admin/admin-approvals/${userId}/approve`)
      setSuccess('Admin approved successfully!')
      loadPendingAdmins()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error approving admin:', err)
      setError(err.response?.data?.detail || 'Failed to approve admin')
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this admin registration? This action cannot be undone.')) {
      return
    }
    
    try {
      setError(null)
      setSuccess(null)
      await api.post(`/admin/admin-approvals/${userId}/reject`)
      setSuccess('Admin registration rejected')
      loadPendingAdmins()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error rejecting admin:', err)
      setError(err.response?.data?.detail || 'Failed to reject admin')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-white via-amber-50/60 to-white rounded-2xl shadow-xl p-8 border-2 border-primary-100 mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Admin Approvals
          </h1>
          <p className="text-gray-600 font-medium">Review and approve new admin registration requests</p>
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

        {/* Pending Admins List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading pending admin approvals...</p>
          </div>
        ) : pendingAdmins.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-primary-100">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pending Approvals</h3>
            <p className="text-gray-600">All admin registration requests have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl shadow-lg p-6 border-2 border-primary-100 hover:border-primary-300 transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {admin.full_name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{admin.full_name}</h3>
                        <p className="text-gray-600">{admin.email}</p>
                        {admin.phone_number && (
                          <p className="text-sm text-gray-500">Phone: {admin.phone_number}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-semibold text-gray-700">Registration Date:</span>{' '}
                        {formatDate(admin.created_at)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>{' '}
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Pending Approval
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    <button
                      onClick={() => handleApprove(admin.id)}
                      className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(admin.id)}
                      className="bg-white border border-gray-200 text-gray-800 hover:border-primary-300 hover:bg-primary-50 px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      Reject
                    </button>
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

