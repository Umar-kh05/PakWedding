/**
 * Toast notification utilities
 * Centralized toast notifications for consistent UX
 */
import toast from 'react-hot-toast'

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#fff',
    color: '#333',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '16px',
    maxWidth: '500px',
  },
}

// Success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    icon: '✅',
    style: {
      ...toastConfig.style,
      border: '2px solid #10b981',
    },
  })
}

// Error toast
export const showError = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    duration: 5000,
    icon: '❌',
    style: {
      ...toastConfig.style,
      border: '2px solid #ef4444',
    },
  })
}

// Info toast
export const showInfo = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
    style: {
      ...toastConfig.style,
      border: '2px solid #3b82f6',
    },
  })
}

// Warning toast
export const showWarning = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      border: '2px solid #f59e0b',
    },
  })
}

// Loading toast
export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...toastConfig,
    duration: Infinity,
  })
}

// Dismiss toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss()
}

// Promise toast - for async operations
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...toastConfig,
      success: {
        icon: '✅',
        style: {
          ...toastConfig.style,
          border: '2px solid #10b981',
        },
      },
      error: {
        icon: '❌',
        style: {
          ...toastConfig.style,
          border: '2px solid #ef4444',
        },
      },
    }
  )
}

// Custom toast with custom styling
export const showCustom = (
  message: string,
  options?: {
    icon?: string
    duration?: number
    style?: React.CSSProperties
  }
) => {
  toast(message, {
    ...toastConfig,
    ...options,
    style: {
      ...toastConfig.style,
      ...options?.style,
    },
  })
}

