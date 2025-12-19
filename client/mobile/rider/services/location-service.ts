import * as Location from 'expo-location';
import { riderService } from './rider-service';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

class LocationService {
  private isTracking = false;
  private trackingInterval: NodeJS.Timeout | null = null;
  private currentLocation: LocationCoords | null = null;
  private updateInterval = 10000; // 10 seconds

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return false;
      }

      // Request background permission for delivery tracking
      const bgStatus = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus.status !== 'granted') {
        console.warn('Background location permission denied');
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Get current location once
   */
  async getCurrentLocation(): Promise<LocationCoords | null> {
    try {
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
      };

      this.currentLocation = coords;
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Check if location permission is granted
   */
  async hasPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Start continuous location tracking
   */
  async startTracking(onLocationChange?: (location: LocationCoords) => void, isOnline = true): Promise<boolean> {
    try {
      if (this.isTracking) return true;

      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) return false;
      }

      this.isTracking = true;

      // Get initial location
      const initialLocation = await this.getCurrentLocation();
      if (initialLocation) {
        onLocationChange?.(initialLocation);
        // Update server with initial location
        await riderService.updateLocation(
          initialLocation.latitude,
          initialLocation.longitude,
          isOnline
        );
      }

      // Setup interval for periodic location updates
      this.trackingInterval = setInterval(async () => {
        const location = await this.getCurrentLocation();
        if (location) {
          onLocationChange?.(location);
          // Update server with new location
          try {
            await riderService.updateLocation(
              location.latitude,
              location.longitude,
              isOnline
            );
          } catch (error) {
            console.error('Error updating location on server:', error);
          }
        }
      }, this.updateInterval);

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      this.isTracking = false;
      return false;
    }
  }

  /**
   * Stop continuous location tracking
   */
  stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.isTracking = false;
  }

  /**
   * Check if currently tracking
   */
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  /**
   * Get last known location
   */
  getLastLocation(): LocationCoords | null {
    return this.currentLocation;
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate estimated time between two coordinates
   * Assumes average speed of 30 km/h for delivery
   */
  estimateDeliveryTime(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    const averageSpeed = 30; // km/h
    const timeInHours = distance / averageSpeed;
    return Math.ceil(timeInHours * 60); // Convert to minutes
  }

  /**
   * Set custom update interval (in milliseconds)
   */
  setUpdateInterval(interval: number): void {
    this.updateInterval = interval;
    if (this.isTracking && this.trackingInterval) {
      clearInterval(this.trackingInterval);
      // Restart with new interval
      this.restartTracking();
    }
  }

  /**
   * Restart tracking with current settings
   */
  private async restartTracking(): Promise<void> {
    const wasTracking = this.isTracking;
    this.stopTracking();

    if (wasTracking) {
      await this.startTracking();
    }
  }
}

export const locationService = new LocationService();
