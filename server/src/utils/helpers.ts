/**
 * General helper utility functions
 * These functions provide various utility helpers for common operations
 */

/**
 * Debounces a function call, delaying its execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 * debouncedSearch('test'); // Will only execute after 300ms of no calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function call, ensuring it can only be called once per specified time limit
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns Throttled function
 * @example
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Groups an array of objects by a specified key
 * @param array - The array to group
 * @param key - The key to group by
 * @returns Object with grouped arrays
 * @example
 * const users = [{ role: 'admin', name: 'John' }, { role: 'user', name: 'Jane' }];
 * groupBy(users, 'role') // { admin: [...], user: [...] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array by a specified key in ascending or descending order
 * @param array - The array to sort
 * @param key - The key to sort by
 * @param order - Sort order ('asc' or 'desc', default: 'asc')
 * @returns Sorted array (new array, does not mutate original)
 * @example
 * const users = [{ age: 30 }, { age: 25 }];
 * sortBy(users, 'age', 'desc') // [{ age: 30 }, { age: 25 }]
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Gets the appropriate color class for an order status
 * @param status - The order status
 * @returns Color identifier string
 * @example getStatusColor('DELIVERED') // 'green'
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    PREPARING: 'purple',
    READY_FOR_PICKUP: 'cyan',
    PICKED_UP: 'indigo',
    OUT_FOR_DELIVERY: 'orange',
    DELIVERED: 'green',
    CANCELLED: 'red',
    REFUNDED: 'gray',
  };
  return colors[status] || 'gray';
}

/**
 * Gets the human-readable text for an order status
 * @param status - The order status
 * @returns Human-readable status text
 * @example getStatusText('OUT_FOR_DELIVERY') // 'On the way'
 */
export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    PENDING: 'Order Placed',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_PICKUP: 'Ready',
    PICKED_UP: 'Picked Up',
    OUT_FOR_DELIVERY: 'On the way',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };
  return texts[status] || status;
}

/**
 * Generates a unique order number
 * @returns Generated order number (e.g., "ORD-ABC123-XY45")
 * @example generateOrderNumber() // "ORD-L8X9F2-A3B4"
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
