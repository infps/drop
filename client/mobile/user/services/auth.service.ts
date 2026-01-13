import { api } from './api'
import { User } from '../types/user.types'

export const authService = {
  async sendOtp(phone: string) {
    return api.post('/auth/send-otp', { phone })
  },

  async verifyOtp(phone: string, otp: string) {
    return api.post<{ token: string; user: User }>('/auth/verify-otp', {
      phone,
      otp,
    })
  },

  async getMe() {
    return api.get<User>('/auth/me')
  },

  async logout() {
    return api.post('/auth/logout')
  },
}
