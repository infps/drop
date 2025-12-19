export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const VEHICLE_TYPES = [
  { label: 'Bicycle', value: 'BICYCLE' },
  { label: 'Scooter', value: 'SCOOTER' },
  { label: 'Bike', value: 'BIKE' },
  { label: 'Electric Bike', value: 'EV_BIKE' },
  { label: 'Electric Scooter', value: 'EV_SCOOTER' },
  { label: 'Car', value: 'CAR' },
  { label: 'Drone', value: 'DRONE' },
] as const;

export const EARNINGS_PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
] as const;

export const LOCATION_UPDATE_INTERVAL = 10000; // 10 seconds
export const BACKGROUND_LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds

export const API_TIMEOUT = 30000; // 30 seconds
export const PAGE_SIZE = 10;

export const RIDER_PERMISSIONS = [
  'location',
  'camera',
  'contacts',
] as const;

export const TABS = {
  HOME: 'home',
  ORDERS: 'orders',
  ACTIVE: 'active',
  EARNINGS: 'earnings',
  PROFILE: 'profile',
} as const;

export const TAB_LABELS = {
  [TABS.HOME]: 'Home',
  [TABS.ORDERS]: 'Orders',
  [TABS.ACTIVE]: 'Active',
  [TABS.EARNINGS]: 'Earnings',
  [TABS.PROFILE]: 'Profile',
} as const;
