import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMM yyyy');
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'hh:mm a');
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd MMM yyyy, hh:mm a');
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatOrderDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isToday(d)) {
    return `Today, ${formatTime(d)}`;
  }
  if (isYesterday(d)) {
    return `Yesterday, ${formatTime(d)}`;
  }
  return formatDateTime(d);
};

export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'New Order',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_PICKUP: 'Ready',
    PICKED_UP: 'Picked Up',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };
  return statusMap[status] || status;
};

export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  };
  return statusMap[status] || status;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};
