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
      const currentPath = window.location.pathname
      const requestUrl = error.config?.url || ''
      const token = useAuthStore.getState().token
      
      // Don't logout if:
      // 1. Already on login/register pages
      // 2. Error is from auth endpoints (login, register, etc.)
      // 3. Error is from booking endpoints (let component handle it)
      // 4. Error is from checklist endpoints (let component handle it)
      // 5. Error is from favorites/reviews endpoints (let component handle it)
      // 6. No token exists (user not logged in, so no need to logout)
      const isAuthEndpoint = requestUrl.includes('/auth/')
      const isBookingError = requestUrl.includes('/bookings')
      const isChecklistError = requestUrl.includes('/checklist')
      const isFavoritesError = requestUrl.includes('/favorites')
      const isReviewsError = requestUrl.includes('/reviews')
      const isOnLoginPage = currentPath === '/login' || currentPath === '/admin/login' || currentPath === '/register' || currentPath === '/vendor/register'
      
      // Only logout if we have a token (user was logged in) and it's not an expected error
      if (token && !isOnLoginPage && !isAuthEndpoint && !isBookingError && !isChecklistError && !isFavoritesError && !isReviewsError) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

