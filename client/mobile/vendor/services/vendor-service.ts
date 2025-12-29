import { apiClient } from './api';
import {
  VendorProfileResponse,
  VendorEarningsResponse,
  UpdateVendorProfileRequest,
  VendorOnboardingData,
} from '../types';

export const vendorService = {
  async getProfile(): Promise<VendorProfileResponse> {
    const response = await apiClient.get<VendorProfileResponse>('/vendor/profile');
    return response.data;
  },

  async updateProfile(data: UpdateVendorProfileRequest): Promise<VendorProfileResponse> {
    const response = await apiClient.put<VendorProfileResponse>('/vendor/profile', data);
    return response.data;
  },

  async getEarnings(period: 'today' | 'week' | 'month' | 'all' = 'today'): Promise<VendorEarningsResponse> {
    const response = await apiClient.get<VendorEarningsResponse>(`/vendor/earnings?period=${period}`);
    return response.data;
  },

  async setOnlineStatus(isActive: boolean): Promise<void> {
    await apiClient.put('/vendor/profile', { isActive });
  },

  async register(data: VendorOnboardingData): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/vendor/register', data);
    return response.data;
  },
};
