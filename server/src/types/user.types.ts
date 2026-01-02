import type { FilterParams } from './api.types'

export interface UserFilters extends FilterParams {
  status?: 'all' | 'verified' | 'unverified'
  isKycVerified?: boolean
  isAgeVerified?: boolean
}

export interface KYCVerification {
  userId: string
  isVerified: boolean
  notes?: string
}
