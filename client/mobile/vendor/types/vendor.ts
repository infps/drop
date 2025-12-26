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
  phone?: string;
  email?: string;
  cuisineTypes?: string[];
  bankAccount?: string;
  ifscCode?: string;
  panNumber?: string;
  gstNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorStats {
  todayOrders: number;
  activeOrders: number;
  todayRevenue: number;
  totalProducts: number;
  totalOrders: number;
  totalReviews: number;
}

export interface VendorProfileResponse {
  vendor: Vendor;
  stats: VendorStats;
}

export interface VendorEarningsResponse {
  grossRevenue: number;
  platformFees: number;
  netEarnings: number;
  period: 'today' | 'week' | 'month' | 'all';
  orders: {
    total: number;
    delivered: number;
    cancelled: number;
  };
}

export interface UpdateVendorProfileRequest {
  name?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
  minimumOrder?: number;
  avgDeliveryTime?: number;
  cuisineTypes?: string[];
  bankAccount?: string;
  ifscCode?: string;
  panNumber?: string;
  gstNumber?: string;
}

export interface VendorOnboardingData {
  // Step 1: Business Info
  businessName: string;
  businessType: VendorType;
  cuisineTypes: string[];
  description: string;
  logo?: string;
  coverImage?: string;

  // Step 2: Owner Details
  ownerName: string;
  phone: string;
  alternatePhone?: string;
  email: string;

  // Step 3: Documents
  gstNumber: string;
  gstCertificate?: string;
  fssaiNumber: string;
  fssaiLicense?: string;
  panNumber: string;
  panCard?: string;
  bankAccount: string;
  ifscCode: string;
  cancelledCheque?: string;

  // Step 4: Store Setup
  address: string;
  city: string;
  pincode: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  avgPrepTime: number;
  minimumOrder: number;
  deliveryRadius: number;
}
