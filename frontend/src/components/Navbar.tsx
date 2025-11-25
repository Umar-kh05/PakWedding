import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PakWedding
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/vendors" className="text-gray-700 hover:text-primary">
              Browse Vendors
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'vendor' ? '/vendor/dashboard' : '/dashboard'} 
                  className="text-gray-700 hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

