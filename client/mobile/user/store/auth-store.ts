import { create } from 'zustand'
import { authService } from '../services/auth.service'
import { storage } from '../utils/storage'
import { User } from '../types/user.types'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setToken: (token: string) => void
  setUser: (user: User) => void
  sendOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  loadSession: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,

  setToken: (token) => set({ token, isAuthenticated: !!token }),

  setUser: (user) => set({ user }),

  sendOtp: async (phone) => {
    set({ isLoading: true })
    try {
      await authService.sendOtp(phone)
    } finally {
      set({ isLoading: false })
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true })
    try {
      const response = await authService.verifyOtp(phone, otp)
      if (response.success && response.data) {
        const { token, user } = response.data
        await storage.setToken(token)
        await storage.setUser(user)
        set({ token, user, isAuthenticated: true })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  loadSession: async () => {
    set({ isLoading: true })
    try {
      const [token, user] = await Promise.all([
        storage.getToken(),
        storage.getUser(),
      ])

      if (token && user) {
        set({ token, user, isAuthenticated: true })
        // Refresh user data from API
        try {
          const response = await authService.getMe()
          if (response.success && response.data) {
            await storage.setUser(response.data)
            set({ user: response.data })
          }
        } catch (error) {
          // If token is invalid, clear session
          await storage.clear()
          set({ token: null, user: null, isAuthenticated: false })
        }
      }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout error
    } finally {
      await storage.clear()
      set({ token: null, user: null, isAuthenticated: false })
    }
  },
}))
