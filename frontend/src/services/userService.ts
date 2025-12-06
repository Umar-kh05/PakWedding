import api from './api'

export type User = {
  id: string
  email: string
  full_name?: string
  phone_number?: string
  role: string
  is_active: boolean
  created_at: string
}

export async function getUserProfile() {
  const { data } = await api.get<User>('/users/me')
  return data
}

export async function updateUserProfile(userData: Partial<User>) {
  const { data } = await api.put<User>('/users/me', userData)
  return data
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  const { data } = await api.put<User>('/users/me/password', {
    old_password: oldPassword,
    new_password: newPassword
  })
  return data
}

