import { useState, useCallback } from 'react';
import { vendorService } from '../services/vendor-service';
import {
  Vendor,
  VendorStats,
  VendorEarningsResponse,
  UpdateVendorProfileRequest,
} from '../types';

export const useVendor = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [earnings, setEarnings] = useState<VendorEarningsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vendorService.getProfile();
      const { stats, ...vendorData } = data;
      setVendor(vendorData as Vendor);
      setStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: UpdateVendorProfileRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await vendorService.updateProfile(data);
        const { stats, ...vendorData } = response;
        setVendor(vendorData as Vendor);
        setStats(stats);
      } catch (err: any) {
        setError(err.message || 'Failed to update profile');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchEarnings = useCallback(
    async (period: 'today' | 'week' | 'month' | 'all' = 'today') => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await vendorService.getEarnings(period);
        setEarnings(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch earnings');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const setOnlineStatus = useCallback(async (isActive: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      await vendorService.setOnlineStatus(isActive);
      setVendor((prev) => (prev ? { ...prev, isActive } : null));
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    vendor,
    stats,
    earnings,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    fetchEarnings,
    setOnlineStatus,
    clearError,
  };
};
