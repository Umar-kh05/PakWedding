import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVendorProfile, updateVendorPackages, Package } from '../../services/vendorService'
import Sidebar from '../../components/Sidebar'

export default function VendorPackagesPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const sidebarItems = [
    { path: '/vendor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/vendor/bookings', label: 'Bookings', icon: '📅' },
    { path: '/vendor/profile', label: 'Profile', icon: '👤' },
    { path: '/vendor/packages', label: 'Packages', icon: '📦' },
    { path: '/vendor/reviews', label: 'Reviews', icon: '⭐' },
  ]

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      setLoading(true)
      const vendor = await getVendorProfile()
      if (vendor.packages && vendor.packages.length > 0) {
        setPackages([...vendor.packages])
      } else {
        // Initialize with default packages if none exist
        setPackages([
          {
            name: 'Basic',
            price: 50000,
            description: 'Basic package - Perfect for intimate celebrations',
            features: ['Standard service coverage', 'Basic setup and delivery', 'Digital documentation', 'Email support'],
          },
          {
            name: 'Standard',
            price: 100000,
            description: 'Standard package - Ideal for most weddings',
            features: ['Enhanced service coverage', 'Extended hours', 'Premium delivery', 'Priority support', 'Additional team members'],
          },
          {
            name: 'Premium',
            price: 200000,
            description: 'Premium package - Luxury experience',
            features: ['Full premium service', 'Complete coverage', 'Priority delivery', 'Dedicated support team', 'Exclusive features', 'Post-event follow-up'],
          },
        ])
      }
    } catch (err: any) {
      console.error('Error loading packages:', err)
      setError(err.response?.data?.detail || 'Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const handlePackageChange = (index: number, field: keyof Package, value: any) => {
    const updatedPackages = [...packages]
    if (field === 'features') {
      updatedPackages[index] = {
        ...updatedPackages[index],
        features: value,
      }
    } else {
      updatedPackages[index] = {
        ...updatedPackages[index],
        [field]: value,
      }
    }
    setPackages(updatedPackages)
  }

  const handleFeatureChange = (packageIndex: number, featureIndex: number, value: string) => {
    const updatedPackages = [...packages]
    const features = [...(updatedPackages[packageIndex].features || [])]
    features[featureIndex] = value
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features,
    }
    setPackages(updatedPackages)
  }

  const addFeature = (packageIndex: number) => {
    const updatedPackages = [...packages]
    const features = [...(updatedPackages[packageIndex].features || [])]
    features.push('')
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features,
    }
    setPackages(updatedPackages)
  }

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const updatedPackages = [...packages]
    const features = [...(updatedPackages[packageIndex].features || [])]
    features.splice(featureIndex, 1)
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features,
    }
    setPackages(updatedPackages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Validate packages
    for (const pkg of packages) {
      if (!pkg.name || !pkg.price || pkg.price <= 0) {
        setError('All packages must have a name and valid price')
        setSaving(false)
        return
      }
    }

    try {
      // Filter out empty features
      const cleanedPackages = packages.map((pkg) => ({
        ...pkg,
        features: pkg.features?.filter((f) => f.trim() !== '') || [],
      }))

      await updateVendorPackages(cleanedPackages)
      setSuccess('Packages updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error updating packages:', err)
      setError(err.response?.data?.detail || 'Failed to update packages')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20">
      <Sidebar items={sidebarItems} title="Vendor Dashboard" />
      <div className="ml-64 flex flex-col overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="text-pink-600 hover:text-pink-700 font-semibold mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Manage Packages
          </h1>
          <p className="text-gray-600 mt-2">Update your service packages and pricing</p>
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Package Name</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={pkg.description || ''}
                    onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Package description..."
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 font-medium">Features</label>
                    <button
                      type="button"
                      onClick={() => addFeature(index)}
                      className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(pkg.features || []).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                          placeholder="Feature description"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="text-red-600 hover:text-red-700 px-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {(!pkg.features || pkg.features.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No features added yet</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Price:</span> Rs. {pkg.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-all text-lg shadow-lg hover:shadow-xl"
            >
              {saving ? 'Saving Packages...' : 'Save All Packages'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard')}
              className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

