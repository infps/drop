import { useState, useCallback, useEffect } from 'react';
import { LocationCoords, locationService } from '../services/location-service';

export interface UseLocationReturn {
  location: LocationCoords | null;
  isTracking: boolean;
  hasPermission: boolean | null;
  error: string | null;

  // Actions
  requestPermission: () => Promise<boolean>;
  startTracking: (isOnline?: boolean) => Promise<void>;
  stopTracking: () => void;
  getCurrentLocation: () => Promise<LocationCoords | null>;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  estimateDeliveryTime: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const granted = await locationService.hasPermission();
        setHasPermission(granted);
      } catch (err) {
        console.error('Error checking location permission:', err);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const granted = await locationService.requestPermissions();
      setHasPermission(granted);
      return granted;
    } catch (err: any) {
      setError(err.message || 'Failed to request location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords | null> => {
    try {
      setError(null);
      const coords = await locationService.getCurrentLocation();
      if (coords) {
        setLocation(coords);
      }
      return coords;
    } catch (err: any) {
      setError(err.message || 'Failed to get current location');
      return null;
    }
  }, []);

  const startTracking = useCallback(async (isOnline: boolean = true) => {
    try {
      setError(null);
      const started = await locationService.startTracking(
        (newLocation) => {
          setLocation(newLocation);
        },
        isOnline
      );

      if (started) {
        setIsTracking(true);
      } else {
        setError('Failed to start location tracking');
      }
    } catch (err: any) {
      setError(err.message || 'Error starting location tracking');
    }
  }, []);

  const stopTracking = useCallback(() => {
    try {
      locationService.stopTracking();
      setIsTracking(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error stopping location tracking');
    }
  }, []);

  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      return locationService.calculateDistance(lat1, lon1, lat2, lon2);
    },
    []
  );

  const estimateDeliveryTime = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      return locationService.estimateDeliveryTime(lat1, lon1, lat2, lon2);
    },
    []
  );

  return {
    location,
    isTracking,
    hasPermission,
    error,
    requestPermission,
    startTracking,
    stopTracking,
    getCurrentLocation,
    calculateDistance,
    estimateDeliveryTime,
  };
};
