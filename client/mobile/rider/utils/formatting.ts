import { format, formatDistanceToNow, parse } from 'date-fns';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number | undefined | null, currency: string = '₹'): string => {
  const value = amount ?? 0;
  return `${currency}${value.toFixed(2)}`;
};

/**
 * Format distance in kilometers
 */
export const formatDistance = (distance: number | undefined | null): string => {
  const value = distance ?? 0;
  if (value < 1) {
    return `${Math.round(value * 1000)}m`;
  }
  return `${value.toFixed(1)}km`;
};

/**
 * Format time duration in minutes
 */
export const formatDuration = (minutes: number | undefined | null): string => {
  const value = minutes ?? 0;
  if (value < 60) {
    return `${Math.round(value)}min`;
  }

  const hours = Math.floor(value / 60);
  const mins = value % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${Math.round(mins)}min`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, pattern: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

/**
 * Format time to readable string
 */
export const formatTime = (date: string | Date, pattern: string = 'HH:mm'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern);
  } catch (error) {
    console.error('Time formatting error:', error);
    return 'Invalid time';
  }
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string | Date, pattern: string = 'MMM dd, yyyy HH:mm'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern);
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return 'Invalid datetime';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Recently';
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Format order number
 */
export const formatOrderNumber = (orderId: string): string => {
  if (orderId.length > 8) {
    return orderId.substring(0, 8).toUpperCase();
  }
  return orderId.toUpperCase();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number | undefined | null, decimals: number = 0): string => {
  const val = value ?? 0;
  return `${val.toFixed(decimals)}%`;
};

/**
 * Format rating
 */
export const formatRating = (rating: number | undefined | null): string => {
  const value = rating ?? 0;
  return `${value.toFixed(1)}⭐`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, length: number = 50): string => {
  if (text.length <= length) {
    return text;
  }
  return `${text.substring(0, length)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format status for display
 */
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_PICKUP: 'Ready for Pickup',
    ASSIGNED: 'Rider Assigned',
    PICKED_UP: 'Picked Up',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    FAILED: 'Failed',
  };

  return statusMap[status] || capitalizeFirst(status);
};
