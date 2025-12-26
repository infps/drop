import { useState, useEffect, useCallback } from 'react';
import { vendorService } from '../services/vendor-service';
import { VendorEarningsResponse } from '../types/vendor';

export function useEarnings(period: 'today' | 'week' | 'month' = 'today') {
  const [earnings, setEarnings] = useState<VendorEarningsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorService.getEarnings(period);
      setEarnings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { earnings, loading, error, refetch: fetchEarnings };
}
