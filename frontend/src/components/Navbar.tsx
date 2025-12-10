import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'
import { showSuccess } from '../utils/toast'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    showSuccess('Logged out successfully. See you soon!')
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-[#D72626]/20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">💍</span>
          <span className="text-xl sm:text-2xl font-bold text-[#D72626] tracking-tight">
            PakWedding
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-[#2A2A2A] font-medium text-base lg:text-lg">
          <li>
            <Link
              to="/"
              className={`relative transition-all duration-300 font-medium ${isActive('/') ? 'text-[#D72626] border-b-2 border-[#D72626] pb-1' : 'hover:text-[#D72626] hover:border-b-2 hover:border-[#D72626]/50 pb-1'}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/vendors"
              className={`relative transition-all duration-300 font-medium ${isActive('/vendors') ? 'text-[#D72626] border-b-2 border-[#D72626] pb-1' : 'hover:text-[#D72626] hover:border-b-2 hover:border-[#D72626]/50 pb-1'}`}
            >
              Vendors
            </Link>
          </li>
          <li>
            <Link
              to="/budget-planner"
              className={`relative transition-all duration-300 font-medium ${isActive('/budget-planner') ? 'text-[#D72626] border-b-2 border-[#D72626] pb-1' : 'hover:text-[#D72626] hover:border-b-2 hover:border-[#D72626]/50 pb-1'}`}
            >
              Budget Planner
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`relative transition-all duration-300 font-medium ${isActive('/about') ? 'text-[#D72626] border-b-2 border-[#D72626] pb-1' : 'hover:text-[#D72626] hover:border-b-2 hover:border-[#D72626]/50 pb-1'}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`relative transition-all duration-300 font-medium ${isActive('/contact') ? 'text-[#D72626] border-b-2 border-[#D72626] pb-1' : 'hover:text-[#D72626] hover:border-b-2 hover:border-[#D72626]/50 pb-1'}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {user ? (
            <>
              <span className="text-[#2A2A2A] text-sm lg:text-base font-medium hidden lg:inline">{user.full_name}</span>
              <Link
                to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="text-[#D72626] hover:text-[#F26D46] font-semibold text-sm lg:text-base transition-all duration-300 hover:underline hover:underline-offset-4"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 lg:px-6 py-2 rounded-xl text-white text-sm lg:text-base font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 lg:px-6 py-2 rounded-xl text-[#D72626] text-sm lg:text-base font-semibold border-2 border-[#D72626] hover:bg-[#FEECEC] transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 lg:px-6 py-2 rounded-xl text-white text-sm lg:text-base font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#D72626] hover:bg-[#FEECEC] transition-all"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D72626]/20 bg-white">
          <ul className="px-4 py-4 space-y-3">
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[#2A2A2A] font-medium ${isActive('/') ? 'text-[#D72626]' : 'hover:text-[#D72626]'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/vendors"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[#2A2A2A] font-medium ${isActive('/vendors') ? 'text-[#D72626]' : 'hover:text-[#D72626]'}`}
              >
                Vendors
              </Link>
            </li>
            <li>
              <Link
                to="/budget-planner"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[#2A2A2A] font-medium ${isActive('/budget-planner') ? 'text-[#D72626]' : 'hover:text-[#D72626]'}`}
              >
                Budget Planner
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[#2A2A2A] font-medium ${isActive('/about') ? 'text-[#D72626]' : 'hover:text-[#D72626]'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-[#2A2A2A] font-medium ${isActive('/contact') ? 'text-[#D72626]' : 'hover:text-[#D72626]'}`}
              >
                Contact
              </Link>
            </li>
            <li className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 font-medium">{user.full_name}</div>
                  <Link
                    to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-[#D72626] font-semibold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-center rounded-xl text-[#D72626] font-semibold border-2 border-[#D72626] hover:bg-[#FEECEC] transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-center rounded-xl text-white font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}