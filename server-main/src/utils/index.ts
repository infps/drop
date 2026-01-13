/**
 * Utility functions index
 * Exports all utility functions from formatters, calculations, helpers, and validators
 */

// Formatting utilities
export {
  formatCurrency,
  formatDistance,
  formatDuration,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  maskPhone,
  maskEmail,
} from './formatters';

// Calculation utilities
export {
  calculateDistance,
  calculateDeliveryFee,
  calculateDeliveryTime,
  calculatePlatformFee,
} from './calculations';

// Helper utilities
export {
  debounce,
  throttle,
  groupBy,
  sortBy,
  getStatusColor,
  getStatusText,
  generateOrderNumber,
} from './helpers';

// Validators (if they exist)
export * from './validators';
