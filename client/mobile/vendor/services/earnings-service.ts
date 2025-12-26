import { apiClient } from './api';
import { VendorEarningsResponse } from '../types/vendor';

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
}

export const earningsService = {
  async getEarnings(period: 'today' | 'week' | 'month' = 'today'): Promise<VendorEarningsResponse> {
    const response = await apiClient.get<VendorEarningsResponse>(`/vendor/earnings?period=${period}`);
    return response.data;
  },

  async getTransactions(page: number = 1, limit: number = 20): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await apiClient.get<{ transactions: Transaction[]; total: number }>(
      `/vendor/earnings/transactions?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async requestPayout(amount: number): Promise<PayoutRequest> {
    const response = await apiClient.post<PayoutRequest>('/vendor/earnings/payout', { amount });
    return response.data;
  },

  async getPayoutHistory(): Promise<PayoutRequest[]> {
    const response = await apiClient.get<PayoutRequest[]>('/vendor/earnings/payouts');
    return response.data;
  },
};
