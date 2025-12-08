import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { fetchVendors, Vendor } from '../services/vendorService'

interface Favorite {
  id: string
  vendor_id: string
  created_at: string
}

export default function FavoritesPage() {
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [vendors, setVendors] = useState<Record<string, Vendor>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const response = await api.get('/favorites')
      const favoritesData = response.data || []
      setFavorites(favoritesData)

      // Load vendor details for each favorite
      const vendorIds = favoritesData.map((f: Favorite) => f.vendor_id)
      const allVendors = await fetchVendors(undefined, 500)
      const vendorMap: Record<string, Vendor> = {}
      allVendors.forEach((v: Vendor) => {
        if (vendorIds.includes(v._id || v.id)) {
          vendorMap[v._id || v.id] = v
        }
      })
      setVendors(vendorMap)
    } catch (err: any) {
      console.error('Error loading favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (vendorId: string) => {
    if (!confirm('Remove this vendor from favorites?')) return
    
    try {
      await api.delete(`/favorites/${vendorId}`)
      setFavorites(prev => prev.filter(f => f.vendor_id !== vendorId))
    } catch (err: any) {
      console.error('Error removing favorite:', err)
      alert(err.response?.data?.detail || 'Failed to remove favorite')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-rose-100">
          <p className="text-xl text-gray-700 mb-4">Please log in to view your favorites.</p>
          <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
            Login Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">Your saved wedding vendors</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-gray-100">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring vendors and add them to your favorites!</p>
            <Link
              to="/vendors"
              className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const vendor = vendors[favorite.vendor_id]
              if (!vendor) return null

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-pink-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-pink-400 group"
                >
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-48 w-full overflow-hidden relative">
                    <Link
                      to={`/vendors/${vendor._id || vendor.id}`}
                      className="block w-full h-full"
                    >
                      {vendor.image_url ? (
                        <img
                          src={vendor.image_url.startsWith('http') ? vendor.image_url : `http://localhost:8000${vendor.image_url}`}
                          alt={vendor.business_name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.vendor_id)}
                      className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                      title="Remove from favorites"
                    >
                      <span className="text-2xl text-red-500">❤️</span>
                    </button>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-white to-pink-50/30">
                    <p className="text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                      {vendor.service_category}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{vendor.business_name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {vendor.rating ?? 4.8}
                      </span>
                      <span>•</span>
                      <span>{vendor.business_address}</span>
                    </div>
                    <Link
                      to={`/vendors/${vendor._id || vendor.id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-semibold hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

