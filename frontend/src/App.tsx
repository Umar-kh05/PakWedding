import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VendorRegisterPage from './pages/auth/VendorRegisterPage'
import BrowseVendorsPage from './pages/vendors/BrowseVendorsPage'
import VendorProfilePage from './pages/vendors/VendorProfilePage'
import UserDashboard from './pages/user/UserDashboard'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorBookingsPage from './pages/vendor/VendorBookingsPage'
import VendorManageProfilePage from './pages/vendor/VendorProfilePage'
import VendorPackagesPage from './pages/vendor/VendorPackagesPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddVendorPage from './pages/admin/AddVendorPage'
import VendorApprovalsPage from './pages/admin/VendorApprovalsPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import ReviewModerationPage from './pages/admin/ReviewModerationPage'
import BookingPage from './pages/bookings/BookingPage'
import BookingHistoryPage from './pages/bookings/BookingHistoryPage'
import BudgetPlannerPage from './pages/BudgetPlannerPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route path="/vendors" element={<BrowseVendorsPage />} />
            <Route path="/services" element={<BookingPage />} />
            <Route path="/vendors/:id" element={<VendorProfilePage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/bookings" element={<VendorBookingsPage />} />
            <Route path="/vendor/profile" element={<VendorManageProfilePage />} />
            <Route path="/vendor/packages" element={<VendorPackagesPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/vendors/add" element={<AddVendorPage />} />
            <Route path="/admin/vendors" element={<VendorApprovalsPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/reviews" element={<ReviewModerationPage />} />
            <Route path="/bookings/new" element={<BookingPage />} />
            <Route path="/bookings/history" element={<BookingHistoryPage />} />
            <Route path="/budget-planner" element={<BudgetPlannerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

