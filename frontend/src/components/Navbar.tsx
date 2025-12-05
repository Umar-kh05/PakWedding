import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-white via-pink-50/30 to-white border-b border-pink-100/50 shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:from-pink-700 hover:to-purple-700 transition-all"
        >
          💍 PakWedding
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li>
            <Link 
              to="/" 
              className={`hover:text-pink-600 transition-colors ${isActive('/') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/vendors" 
              className={`hover:text-pink-600 transition-colors ${isActive('/vendors') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              Vendors
            </Link>
          </li>
          <li>
            <Link 
              to="/services" 
              className={`hover:text-pink-600 transition-colors ${isActive('/services') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              to="/budget-planner" 
              className={`hover:text-pink-600 transition-colors ${isActive('/budget-planner') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              Budget Planner
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`hover:text-pink-600 transition-colors ${isActive('/about') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`hover:text-pink-600 transition-colors ${isActive('/contact') ? 'text-pink-600 border-b-2 border-pink-600 pb-1' : ''}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 text-sm">{user.full_name}</span>
              <Link
                to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="text-pink-600 hover:text-pink-700 text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
          <Link
            to="/login"
                className="border-2 border-pink-600 text-pink-600 px-5 py-1.5 rounded-md hover:bg-pink-50 transition-colors"
          >
            Login
          </Link>
          <Link
                to="/register"
                className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-1.5 rounded-md transition-colors"
          >
            Sign Up
          </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}