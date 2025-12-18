/**
 * Calculation utility functions
 * These functions provide various calculations for distance, fees, delivery times, etc.
 */

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 * @example calculateDistance(28.7041, 77.1025, 28.5355, 77.3910) // ~41000 (41km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculates the delivery fee based on distance and other factors
 * @param distance - Distance in meters
 * @param baseFee - Base delivery fee (default: 20)
 * @param perKmRate - Rate per kilometer (default: 5)
 * @param surgePricing - Surge pricing multiplier (default: 1)
 * @returns Calculated delivery fee
 * @example calculateDeliveryFee(3000, 20, 5, 1.5) // 53 (rounded)
 */
export function calculateDeliveryFee(
  distance: number,
  baseFee: number = 20,
  perKmRate: number = 5,
  surgePricing: number = 1
): number {
  const distanceKm = distance / 1000;
  const fee = baseFee + distanceKm * perKmRate;
  return Math.round(fee * surgePricing);
}

/**
 * Calculates the estimated delivery time
 * @param prepTime - Preparation time in minutes
 * @param distance - Distance in meters
 * @param avgSpeed - Average delivery speed in km/h (default: 25)
 * @returns Estimated delivery time in minutes
 * @example calculateDeliveryTime(30, 5000, 25) // ~47 minutes (30 prep + 12 travel + 5 buffer)
 */
export function calculateDeliveryTime(
  prepTime: number,
  distance: number,
  avgSpeed: number = 25
): number {
  const travelTime = (distance / 1000 / avgSpeed) * 60; // in minutes
  return Math.round(prepTime + travelTime + 5); // +5 min buffer
}

/**
 * Calculates the platform fee based on order value
 * @param orderValue - Total order value
 * @param feePercentage - Platform fee percentage (default: 10)
 * @param minFee - Minimum platform fee (default: 5)
 * @param maxFee - Maximum platform fee (default: 100)
 * @returns Calculated platform fee
 * @example calculatePlatformFee(500, 10, 5, 100) // 50
 */
export function calculatePlatformFee(
  orderValue: number,
  feePercentage: number = 10,
  minFee: number = 5,
  maxFee: number = 100
): number {
  const fee = (orderValue * feePercentage) / 100;
  return Math.min(Math.max(fee, minFee), maxFee);
}
