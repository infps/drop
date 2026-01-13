import React, { createContext, useState, useCallback, useEffect } from 'react'
import { User } from '../types/user.types'
import { authService } from '../services/auth.service'
import { storage } from '../utils/storage'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  token: string | null
  error: string | null

  sendOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  checkAuth: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        const [savedToken, savedUser] = await Promise.all([
          storage.getToken(),
          storage.getUser(),
        ])

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(savedUser)

          try {
            const response = await authService.getMe()
            if (response.success && response.data) {
              setUser(response.data)
              await storage.setUser(response.data)
            }
          } catch (err) {
            await storage.clear()
            setToken(null)
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const sendOtp = useCallback(async (phone: string) => {
    try {
      setError(null)
      setIsLoading(true)
      await authService.sendOtp(phone)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await authService.verifyOtp(phone, otp)
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data
        await storage.setToken(newToken)
        await storage.setUser(newUser)
        setToken(newToken)
        setUser(newUser)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      await storage.clear()
      setUser(null)
      setToken(null)
      setError(null)
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const hasToken = await storage.getToken()
    return !!(hasToken && user)
  }, [user])

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!(user && token),
    token,
    error,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
