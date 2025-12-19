import { useState, useCallback, useEffect } from 'react';
import { Rider, RiderEarningsResponse } from '../types';
import { riderService } from '../services/rider-service';

export interface UseRiderReturn {
  rider: Rider | null;
  earnings: RiderEarningsResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Rider>) => Promise<void>;
  fetchEarnings: (period?: 'today' | 'week' | 'month' | 'all', page?: number) => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useRider = (): UseRiderReturn => {
  const [rider, setRider] = useState<Rider | null>(null);
  const [earnings, setEarnings] = useState<RiderEarningsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await riderService.getProfile();
      setRider(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rider profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<Rider>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await riderService.updateProfile(data);
      setRider(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEarnings = useCallback(
    async (period: 'today' | 'week' | 'month' | 'all' = 'today', page: number = 1) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await riderService.getEarnings(period, page);
        setEarnings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch earnings');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const setOnlineStatus = useCallback(async (isOnline: boolean) => {
    try {
      setError(null);
      await riderService.setOnlineStatus(isOnline);
      if (rider) {
        setRider({ ...rider, isOnline });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update online status');
      throw err;
    }
  }, [rider]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchProfile();
      await fetchEarnings('today');
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, fetchEarnings]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    rider,
    earnings,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    fetchEarnings,
    setOnlineStatus,
    clearError,
    refresh,
  };
};
