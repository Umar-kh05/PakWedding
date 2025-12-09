import { useState, useEffect } from 'react'
import api from '../../services/api'
import Sidebar from '../../components/Sidebar'

interface User {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  is_active: boolean
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/vendors', label: 'Vendor Approvals', icon: '✅' },
    { path: '/admin/vendors/add', label: 'Add Vendor', icon: '➕' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/reviews', label: 'Review Moderation', icon: '⭐' },
    { path: '/admin/admin-approvals', label: 'Admin Approvals', icon: '🔐' },
  ]

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-active`)
      alert('User status updated')
      loadUsers()
    } catch (error) {
      alert('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="Admin Dashboard" />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="py-8 px-4 sm:pl-8">
          <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-3 text-left">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[#D72626] hover:text-[#F26D46] font-semibold transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-700 font-medium">Manage all platform users</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-primary-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-primary-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-50 to-orange-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-primary-50/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-[#D72626] capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${user.is_active
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

