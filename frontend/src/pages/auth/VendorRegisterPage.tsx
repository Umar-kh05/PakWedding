import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    business_address: '',
    service_category: '',
    password: '',
    confirm_password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const categories = [
    'Photographer', 'Caterer', 'Venue', 'Decorator', 
    'Makeup Artist', 'Music & Entertainment'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }

    try {
      await api.post('/vendors/register', {
        business_name: formData.business_name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone_number: formData.phone_number,
        business_address: formData.business_address,
        service_category: formData.service_category,
        password: formData.password
      })

      alert('Registration successful! Please wait for admin approval.')
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Vendor Registration</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Contact Person</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Business Address</label>
            <input
              type="text"
              value={formData.business_address}
              onChange={(e) => setFormData({...formData, business_address: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Service Category</label>
            <select
              value={formData.service_category}
              onChange={(e) => setFormData({...formData, service_category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            Register as Vendor
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

