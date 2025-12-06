import api from './api'

export type Package = {
  name: string
  price: number
  description?: string
  features?: string[]
}

export type Vendor = {
  _id?: string
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
  packages?: Package[]
  is_approved?: boolean
  is_active?: boolean
  created_at?: string
}

export async function fetchVendors(category?: string, limit: number = 200) {
  const params: any = { limit }
  if (category) {
    params.category = category
  }
  const { data } = await api.get<Vendor[]>('/vendors', { params })
  return data
}

export async function fetchVendorById(id: string) {
  const { data } = await api.get<Vendor>(`/vendors/${id}`)
  return data
}


