import { ReactNode, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuthStore } from '../store/authStore'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, checkSessionExpiry } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // Check session expiry every minute
    const interval = setInterval(() => {
      if (user && checkSessionExpiry()) {
        // Session expired, will be handled by checkSessionExpiry
        const isOnLoginPage = location.pathname === '/login' || 
                             location.pathname === '/admin/login' || 
                             location.pathname === '/register' || 
                             location.pathname === '/vendor/register'
        if (!isOnLoginPage) {
          alert('Your session has expired. Please log in again.')
          window.location.href = '/login'
        }
      }
    }, 60000) // Check every minute

    // Check session when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && user && checkSessionExpiry()) {
        const isOnLoginPage = location.pathname === '/login' || 
                             location.pathname === '/admin/login' || 
                             location.pathname === '/register' || 
                             location.pathname === '/vendor/register'
        if (!isOnLoginPage) {
          alert('Your session has expired. Please log in again.')
          window.location.href = '/login'
        }
      }
    }

    // Check session when window gets focus (user clicks back into browser)
    const handleFocus = () => {
      if (user && checkSessionExpiry()) {
        const isOnLoginPage = location.pathname === '/login' || 
                             location.pathname === '/admin/login' || 
                             location.pathname === '/register' || 
                             location.pathname === '/vendor/register'
        if (!isOnLoginPage) {
          alert('Your session has expired. Please log in again.')
          window.location.href = '/login'
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [user, checkSessionExpiry, location.pathname])

  // Check session expiry on mount
  useEffect(() => {
    if (user && checkSessionExpiry()) {
      const isOnLoginPage = location.pathname === '/login' || 
                           location.pathname === '/admin/login' || 
                           location.pathname === '/register' || 
                           location.pathname === '/vendor/register'
      if (!isOnLoginPage) {
        window.location.href = '/login'
      }
    }
  }, [user, checkSessionExpiry, location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

