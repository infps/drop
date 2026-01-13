import { api } from './api'
import { User, Address, Wallet, WalletTransaction } from '../types/user.types'
import { PaginatedResponse } from '../types/api.types'

export const userService = {
  // Profile
  async getProfile() {
    return api.get<User>('/user/profile')
  },

  async updateProfile(data: Partial<User>) {
    return api.put<User>('/user/profile', data)
  },

  // Addresses
  async getAddresses() {
    return api.get<Address[]>('/user/addresses')
  },

  async addAddress(data: Omit<Address, 'id'>) {
    return api.post<Address>('/user/addresses', data)
  },

  async updateAddress(id: string, data: Partial<Address>) {
    return api.put<Address>(`/user/addresses/${id}`, data)
  },

  async deleteAddress(id: string) {
    return api.delete(`/user/addresses/${id}`)
  },

  // Wallet
  async getWallet(page?: number, limit?: number): Promise<PaginatedResponse<WalletTransaction>> {
    return api.get('/wallet', { page, limit })
  },

  async addMoney(amount: number, paymentMethod: string, transactionId: string) {
    return api.post('/wallet/add-money', { amount, paymentMethod, transactionId })
  },
}
