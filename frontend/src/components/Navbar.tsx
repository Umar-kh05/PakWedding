import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-white via-rose-50/40 to-white border-b border-rose-100/60 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent flex items-center gap-2 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 transition-all duration-300 transform hover:scale-105"
        >
          💍 PakWedding
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-800 font-medium">
          <li>
            <Link 
              to="/" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/vendors" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/vendors') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
            >
              Vendors
            </Link>
          </li>
          <li>
            <Link 
              to="/services" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/services') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              to="/budget-planner" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/budget-planner') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
            >
              Budget Planner
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/about') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`relative transition-all duration-300 font-semibold ${isActive('/contact') ? 'text-primary-600 border-b-2 border-primary-600 pb-1' : 'hover:text-primary-600 hover:border-b-2 hover:border-primary-400 pb-1'}`}
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
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-all duration-300 hover:underline hover:underline-offset-4"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
          <Link
            to="/login"
                className="border-2 border-primary-600 text-primary-600 px-5 py-1.5 rounded-md hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
          >
            Login
          </Link>
          <Link
                to="/register"
                className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 text-white px-5 py-1.5 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
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