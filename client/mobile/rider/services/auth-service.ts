import { apiClient } from './api';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthUser,
} from '../types';

export const authService = {
  /**
   * Send OTP to rider's phone number
   */
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await apiClient.post<SendOtpResponse>('/auth/send-otp', data);
    return response.data;
  },

  /**
   * Verify OTP and get authentication token
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', data);
    const { token } = response.data;

    // Store token securely
    if (token) {
      await apiClient.setToken(token);
    }

    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
  },

  /**
   * Logout and clear stored token
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await apiClient.clearToken();
    }
  },

  /**
   * Check if token exists
   */
  async hasToken(): Promise<boolean> {
    const token = await apiClient.getToken();
    return !!token;
  },

  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return await apiClient.getToken();
  },

  /**
   * Clear token
   */
  async clearToken(): Promise<void> {
    return await apiClient.clearToken();
  },
};
