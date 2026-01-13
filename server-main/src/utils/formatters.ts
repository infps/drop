/**
 * Formatting utility functions
 * These functions provide consistent formatting for currency, dates, times, distances, etc.
 */

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'INR')
 * @returns Formatted currency string
 * @example formatCurrency(1234.56) // "₹1,235"
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats distance in meters to a human-readable string
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "500 m" or "2.5 km")
 * @example formatDistance(1500) // "1.5 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats duration in minutes to a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "45 min" or "2h 30m")
 * @example formatDuration(90) // "1h 30m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Formats a date to a localized date string
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "18 Dec 2025")
 * @example formatDate(new Date()) // "18 Dec 2025"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a date to a localized time string
 * @param date - Date object or ISO string
 * @returns Formatted time string (e.g., "14:30")
 * @example formatTime(new Date()) // "14:30"
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date to a combined date and time string
 * @param date - Date object or ISO string
 * @returns Formatted date and time string
 * @example formatDateTime(new Date()) // "18 Dec 2025 at 14:30"
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

/**
 * Formats a date as relative time from now
 * @param date - Date object or ISO string
 * @returns Relative time string (e.g., "5m ago", "2h ago", "3d ago")
 * @example formatRelativeTime(new Date(Date.now() - 300000)) // "5m ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

/**
 * Masks a phone number for privacy
 * @param phone - Phone number string
 * @returns Masked phone number (e.g., "98****5678")
 * @example maskPhone("9876543210") // "98****3210"
 */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return phone;
  return phone.substring(0, 2) + '****' + phone.substring(6);
}

/**
 * Masks an email address for privacy
 * @param email - Email address string
 * @returns Masked email address (e.g., "j***n@example.com")
 * @example maskEmail("john@example.com") // "j***n@example.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;
  return local[0] + '***' + local[local.length - 1] + '@' + domain;
}
