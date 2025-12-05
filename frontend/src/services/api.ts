import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Use proxy in development, direct URL in production
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // In development, use proxy if available, otherwise direct URL
  if (import.meta.env.DEV) {
    return '/api' // Use Vite proxy
  }
  return 'http://localhost:8000/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.warn('No token found in auth store for request:', config.url)
  }
  
  // Ensure trailing slash for POST requests to root endpoints to avoid redirect issues
  // FastAPI redirects /api/bookings to /api/bookings/, which loses Authorization header
  if (config.method === 'post' && config.url && 
      config.url.endsWith('/bookings') && 
      !config.url.endsWith('/')) {
    config.url = config.url + '/'
  }
  
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and not a booking-related error
      const currentPath = window.location.pathname
      const isBookingError = error.config?.url?.includes('/bookings')
      
      // Don't redirect if already on login page or if it's a booking error (let component handle it)
      if (currentPath !== '/login' && currentPath !== '/admin/login' && !isBookingError) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

