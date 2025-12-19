import { apiClient } from './api';
import {
  Rider,
  RiderEarningsResponse,
  RiderStats,
} from '../types';

export const riderService = {
  /**
   * Get current rider's profile
   */
  async getProfile(): Promise<Rider> {
    const response = await apiClient.get<Rider>('/rider/profile');
    return response.data;
  },

  /**
   * Update rider profile
   */
  async updateProfile(data: Partial<Rider>): Promise<Rider> {
    const response = await apiClient.put<Rider>('/rider/profile', data);
    return response.data;
  },

  /**
   * Get rider earnings
   */
  async getEarnings(period: 'today' | 'week' | 'month' | 'all' = 'today', page = 1, limit = 10): Promise<RiderEarningsResponse> {
    const response = await apiClient.get<RiderEarningsResponse>('/rider/earnings', {
      params: { period, page, limit },
    });
    return response.data;
  },

  /**
   * Update rider location (real-time tracking)
   */
  async updateLocation(latitude: number, longitude: number, isOnline: boolean): Promise<void> {
    await apiClient.post('/rider/location', {
      latitude,
      longitude,
      isOnline,
    });
  },

  /**
   * Get current rider location status
   */
  async getLocationStatus(): Promise<{
    isOnline: boolean;
    isAvailable: boolean;
    currentLat: number;
    currentLng: number;
    assignedZone: string;
    activeOrdersCount: number;
  }> {
    const response = await apiClient.get('/rider/location');
    return response.data;
  },

  /**
   * Toggle online status
   */
  async setOnlineStatus(isOnline: boolean): Promise<void> {
    await apiClient.post('/rider/location', {
      isOnline,
    });
  },

  /**
   * Get rider stats
   */
  async getStats(): Promise<RiderStats> {
    const response = await apiClient.get<RiderStats>('/rider/stats');
    return response.data;
  },
};
