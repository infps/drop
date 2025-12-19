import React, { createContext, useState, useCallback, useEffect } from 'react';
import { AuthUser } from '../types';
import { authService } from '../services/auth-service';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  token: string | null;
  error: string | null;

  // Actions
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const hasToken = await authService.hasToken();

        if (hasToken) {
          const currentToken = await authService.getToken();
          setToken(currentToken);

          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (err) {
            // Token might be invalid, clear it
            await authService.clearToken();
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.sendOtp({ phone });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.verifyOtp({ phone, otp });
      setToken(response.token);

      if (response.rider) {
        setUser({
          id: response.rider.id,
          name: response.rider.name,
          email: response.rider.email,
          phone: response.rider.phone,
          avatar: response.rider.avatar,
          type: 'rider',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setToken(null);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      // Still clear local state even if server logout fails
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const hasToken = await authService.hasToken();
    return hasToken && !!user;
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user && !!token,
    token,
    error,
    sendOtp,
    verifyOtp,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
