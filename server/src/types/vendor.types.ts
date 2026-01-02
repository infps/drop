import type { FilterParams } from './api.types'

export interface VendorFilters extends FilterParams {
  type?: string
  isVerified?: boolean
  isActive?: boolean
  status?: 'all' | 'active' | 'pending' | 'suspended'
}

export interface VendorApproval {
  vendorId: string
  isVerified: boolean
  notes?: string
}

export interface VendorStatusUpdate {
  vendorId: string
  isActive: boolean
  reason?: string
}

export interface VendorCreate {
  name: string
  description: string
  type: string
  email: string
  phone: string
  password: string
  address: string
  latitude: number
  longitude: number
  openingTime: string
  closingTime: string
  minimumOrder?: number
  commissionRate?: number
}
