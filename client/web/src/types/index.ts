// ==================== USER TYPES ====================
export interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  avatar?: string;
  dateOfBirth?: Date;
  isKycVerified: boolean;
  isAgeVerified: boolean;
  preferredLanguage: string;
  cuisinePreferences: string[];
  groceryBrands: string[];
  alcoholPreferences: string[];
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

// ==================== VENDOR TYPES ====================
export type VendorType =
  | 'RESTAURANT'
  | 'GROCERY'
  | 'WINE_SHOP'
  | 'PHARMACY'
  | 'MEAT_SHOP'
  | 'MILK_DAIRY'
  | 'PET_SUPPLIES'
  | 'FLOWERS'
  | 'GENERAL_STORE';

export interface Vendor {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  type: VendorType;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalRatings: number;
  address: string;
  latitude: number;
  longitude: number;
  deliveryRadius: number;
  openingTime: string;
  closingTime: string;
  minimumOrder: number;
  avgDeliveryTime: number;
  commissionRate: number;
  licenseNumber?: string;
  licenseExpiry?: Date;
  categories?: Category[];
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  vendorId?: string;
  parentId?: string;
  sortOrder: number;
  children?: Category[];
  products?: Product[];
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId?: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
  isVeg: boolean;
  isVegan: boolean;
  calories?: number;
  allergens: string[];
  packSize?: string;
  brand?: string;
  dietType?: string;
  abvPercent?: number;
  tasteProfile?: string;
  countryOfOrigin?: string;
  year?: number;
  grapeType?: string;
}

// ==================== CART & ORDER TYPES ====================
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedCustomization?: Record<string, string>;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  addressId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'RAZORPAY' | 'WALLET' | 'CASH_ON_DELIVERY';

// ==================== SPECIAL FEATURES ====================
export interface GenieOrder {
  id: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  stops: GenieStop[];
  estimatedTime: number;
  createdAt: Date;
}

export interface GenieStop {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  items: string;
}

export interface PartyEvent {
  id: string;
  ownerId: string;
  name: string;
  participants: PartyParticipant[];
  sharedCart: CartItem[];
  totalAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
}

export interface PartyParticipant {
  userId: string;
  name: string;
  items: CartItem[];
}

// ==================== LOCATION & DELIVERY ====================
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// ==================== COMMON TYPES ====================
export interface Review {
  id: string;
  userId: string;
  vendorId?: string;
  productId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  createdAt: Date;
}

export interface LoyaltyPoints {
  userId: string;
  totalPoints: number;
  pointsHistory: PointsHistory[];
}

export interface PointsHistory {
  id: string;
  userId: string;
  points: number;
  reason: string;
  createdAt: Date;
}

export interface Subscription {
  userId: string;
  type: 'PRIME' | 'REGULAR';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  benefits: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'REMINDER';
  isRead: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  sortBy?: 'rating' | 'delivery_time' | 'distance' | 'price';
  minPrice?: number;
  maxPrice?: number;
  isOpen?: boolean;
  hasDiscount?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
