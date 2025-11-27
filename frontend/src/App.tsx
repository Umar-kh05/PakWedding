import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VendorRegisterPage from './pages/auth/VendorRegisterPage'
import BrowseVendorsPage from './pages/vendors/BrowseVendorsPage'
import VendorProfilePage from './pages/vendors/VendorProfilePage'
import UserDashboard from './pages/user/UserDashboard'
import VendorDashboard from './pages/vendor/VendorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import BookingPage from './pages/bookings/BookingPage'
import BookingHistoryPage from './pages/bookings/BookingHistoryPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route path="/vendors" element={<BrowseVendorsPage />} />
            <Route path="/services" element={<BookingPage />} />
            <Route path="/vendors/:id" element={<VendorProfilePage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/bookings/new" element={<BookingPage />} />
            <Route path="/bookings/history" element={<BookingHistoryPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

