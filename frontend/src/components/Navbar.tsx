import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-pink-600 flex items-center gap-2"
        >
          💍 PakWedding
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-pink-600">
              Home
            </Link>
          </li>

          <li>
            <Link to="/vendors" className="hover:text-pink-600">
              Vendors
            </Link>
          </li>

          <li>
            <Link to="/services" className="hover:text-pink-600">
              Services
            </Link>
          </li>

          <li>
            <Link to="/budget-planner" className="hover:text-pink-600">
              Budget Planner
            </Link>
          </li>

          <li>
            <Link to="/about" className="hover:text-pink-600">
              About
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-pink-600">
              Contact
            </Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="border-2 border-pink-600 text-pink-600 px-5 py-1.5 rounded-md hover:bg-pink-50"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-pink-600 text-white px-5 py-1.5 rounded-md hover:bg-pink-700"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}