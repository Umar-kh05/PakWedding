import api from './api'

export type Vendor = {
  _id: string
  id?: string
  business_name: string
  contact_person: string
  email: string
  phone_number: string
  business_address: string
  service_category: string
  rating?: number
  total_bookings?: number
  image_url?: string
  gallery_images?: string[]
  description?: string
}

export async function fetchVendors(category?: string) {
  const params = category ? { category } : undefined
  const { data } = await api.get<Vendor[]>('/vendors', { params })
  return data
}

export async function fetchVendorById(id: string) {
  const { data } = await api.get<Vendor>(`/vendors/${id}`)
  return data
}


