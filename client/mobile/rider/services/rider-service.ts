import { apiClient } from './api';
import {
  Rider,
  RiderEarningsResponse,
  RiderStats,
  Withdrawal,
  WithdrawalsResponse,
} from '../types';

export const riderService = {
  /**
   * Get current rider's profile
   */
  async getProfile(): Promise<Rider> {
    try {
      console.log('Fetching rider profile');
      const response = await apiClient.get<Rider>('/rider/profile');
      console.log('Profile response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch profile:', {
        error: error.message,
        details: error.details,
        code: error.code,
        statusCode: error.statusCode,
      });
      throw error;
    }
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
    try {
      console.log('Fetching earnings for period:', period);
      const response = await apiClient.get<RiderEarningsResponse>('/rider/earnings', {
        params: { period, page, limit },
      });
      console.log('Earnings response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch earnings:', {
        error: error.message,
        details: error.details,
        code: error.code,
        statusCode: error.statusCode,
      });
      throw error;
    }
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
  async setOnlineStatus(isOnline: boolean): Promise<{ isOnline: boolean; isAvailable: boolean }> {
    const response = await apiClient.post<{ isOnline: boolean; isAvailable: boolean }>('/rider/status', {
      isOnline,
    });
    return response.data;
  },

  /**
   * Get rider stats
   */
  async getStats(): Promise<RiderStats> {
    const response = await apiClient.get<RiderStats>('/rider/stats');
    return response.data;
  },

  /**
   * Request a withdrawal
   */
  async requestWithdrawal(amount: number): Promise<Withdrawal> {
    const response = await apiClient.post<Withdrawal>('/rider/withdrawals', { amount });
    return response.data;
  },

  /**
   * Get withdrawal history
   */
  async getWithdrawals(page = 1, limit = 20): Promise<WithdrawalsResponse> {
    const response = await apiClient.get<WithdrawalsResponse>('/rider/withdrawals', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get pending withdrawal (if any)
   */
  async getPendingWithdrawal(): Promise<Withdrawal | null> {
    const response = await apiClient.get<Withdrawal | null>('/rider/withdrawals/pending');
    return response.data;
  },
};
