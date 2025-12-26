export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: '#FFA726',
  CONFIRMED: '#42A5F5',
  PREPARING: '#7E57C2',
  READY_FOR_PICKUP: '#26A69A',
  PICKED_UP: '#66BB6A',
  OUT_FOR_DELIVERY: '#29B6F6',
  DELIVERED: '#4CAF50',
  CANCELLED: '#EF5350',
  REFUNDED: '#78909C',
};

export const VENDOR_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'GROCERY', label: 'Grocery' },
  { value: 'WINE_SHOP', label: 'Wine Shop' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'MEAT_SHOP', label: 'Meat Shop' },
  { value: 'MILK_DAIRY', label: 'Milk & Dairy' },
  { value: 'PET_SUPPLIES', label: 'Pet Supplies' },
  { value: 'FLOWERS', label: 'Flowers' },
  { value: 'GENERAL_STORE', label: 'General Store' },
];

export const CUISINE_TYPES = [
  'North Indian',
  'South Indian',
  'Chinese',
  'Italian',
  'Mexican',
  'Continental',
  'Fast Food',
  'Street Food',
  'Desserts',
  'Beverages',
  'Bakery',
  'Seafood',
  'Biryani',
  'Pizza',
  'Burgers',
  'Healthy',
];

export const POLLING_INTERVAL = 30000; // 30 seconds
