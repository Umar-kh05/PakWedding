import { useEffect, useState } from 'react'
import api from '../services/api'

interface PasswordStrengthMeterProps {
  password: string
  onStrengthChange?: (isValid: boolean) => void
}

export default function PasswordStrengthMeter({ password, onStrengthChange }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<string>('weak')
  const [issues, setIssues] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const checkStrength = async () => {
      if (!password) {
        setStrength('weak')
        setIssues([])
        setIsValid(false)
        onStrengthChange?.(false)
        return
      }

      try {
        const response = await api.post('/auth/check-password-strength', { password })
        setStrength(response.data.strength)
        setIssues(response.data.issues || [])
        setIsValid(response.data.is_valid)
        onStrengthChange?.(response.data.is_valid)
      } catch (err) {
        console.error('Error checking password strength:', err)
      }
    }

    const debounce = setTimeout(checkStrength, 300)
    return () => clearTimeout(debounce)
  }, [password, onStrengthChange])

  if (!password) return null

  const getStrengthColor = () => {
    switch (strength) {
      case 'very_strong':
        return 'bg-green-500'
      case 'strong':
        return 'bg-blue-500'
      case 'moderate':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  const getStrengthWidth = () => {
    switch (strength) {
      case 'very_strong':
        return 'w-full'
      case 'strong':
        return 'w-3/4'
      case 'moderate':
        return 'w-1/2'
      default:
        return 'w-1/4'
    }
  }

  const getStrengthText = () => {
    switch (strength) {
      case 'very_strong':
        return 'Very Strong'
      case 'strong':
        return 'Strong'
      case 'moderate':
        return 'Moderate'
      default:
        return 'Weak'
    }
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
        <span className={`text-xs font-semibold ${
          isValid ? 'text-green-600' : 'text-gray-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="text-xs space-y-1">
          {issues.map((issue, index) => (
            <div key={index} className="flex items-start gap-1 text-red-600">
              <span className="mt-0.5">•</span>
              <span>{issue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {isValid && issues.length === 0 && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <span>✓</span>
          <span>Password meets all requirements</span>
        </div>
      )}
    </div>
  )
}

