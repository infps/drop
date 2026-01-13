export interface User {
  id: string
  phone: string
  name: string
  email?: string
  avatar?: string
  dateOfBirth?: string
  isKycVerified?: boolean
  createdAt: string
}

export interface Address {
  id: string
  label: string
  fullAddress: string
  landmark?: string
  latitude: number
  longitude: number
  isDefault: boolean
}

export interface Wallet {
  id: string
  balance: number
}

export interface WalletTransaction {
  id: string
  type: 'CREDIT' | 'DEBIT'
  amount: number
  description: string
  createdAt: string
}

export interface LoyaltyPoints {
  points: number
  tier: string
  lifetimePoints: number
}
