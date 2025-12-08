import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-[#F4E9DB] border-b border-[#D72626]/20 shadow-sm">
      <div className="container mx-auto px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💍</span>
          <span className="text-2xl font-bold text-[#D72626] tracking-tight">
            PakWedding
          </span>
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 text-[#2A2A2A] font-medium text-lg">
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

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-[#2A2A2A] text-base font-medium">{user.full_name}</span>
              <Link
                to={user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="text-[#D72626] hover:text-[#F26D46] font-semibold text-base transition-all duration-300 hover:underline hover:underline-offset-4"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-xl text-white text-base font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl text-[#D72626] text-base font-semibold border-2 border-[#D72626] hover:bg-[#FEECEC] transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 rounded-xl text-white text-base font-semibold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
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