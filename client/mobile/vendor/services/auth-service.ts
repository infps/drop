import { apiClient } from './api';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  AuthUser,
} from '../types';

export const authService = {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    const response = await apiClient.post<SendOtpResponse>(
      '/auth/send-otp',
      data
    );
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await apiClient.post<VerifyOtpResponse>(
      '/auth/verify-otp',
      {
        ...data,
        type: 'vendor',
      }
    );
    const { token } = response.data;

    if (token) {
      await apiClient.setToken(token);
    }

    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await apiClient.clearToken();
    }
  },

  async hasToken(): Promise<boolean> {
    const token = await apiClient.getToken();
    return !!token;
  },

  async getToken(): Promise<string | null> {
    return await apiClient.getToken();
  },

  async clearToken(): Promise<void> {
    return await apiClient.clearToken();
  },
};
