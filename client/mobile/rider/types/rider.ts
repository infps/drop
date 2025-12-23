export type VehicleType = 'BICYCLE' | 'SCOOTER' | 'BIKE' | 'EV_BIKE' | 'EV_SCOOTER' | 'CAR' | 'DRONE';

export interface Rider {
  id: string;
  phone: string;
  email?: string;
  name: string;
  avatar?: string;
  documentVerified: boolean;
  policeVerified: boolean;
  alcoholAuthorized: boolean;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  isOnline: boolean;
  isAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  assignedZone?: string;
  // Bank Details
  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;
  ifscCode?: string;
  accountHolderName?: string;
  panNumber?: string;
  createdAt: string;
  updatedAt: string;
  // Stats
  todayDeliveries?: number;
  todayEarnings?: number;
  activeOrdersCount?: number;
}

export interface RiderEarning {
  id: string;
  riderId: string;
  date: string;
  baseEarning: number;
  tip: number;
  incentive: number;
  penalty: number;
  total: number;
}

export interface RiderEarningsResponse {
  earnings: RiderEarning[];
  summary: {
    baseEarning: number;
    tips: number;
    total: number; // Available balance (can be withdrawn)
    totalEarned?: number; // Lifetime earnings
    totalWithdrawn?: number; // Total already withdrawn
    count: number;
  };
  rider?: {
    totalDeliveries: number;
    totalEarnings: number;
    rating: number;
  };
  page: number;
  limit: number;
  total: number;
}

export interface RiderStats {
  totalDeliveries: number;
  totalEarnings: number;
  todayDeliveries: number;
  todayEarnings: number;
  rating: number;
  activeOrders: number;
  isOnline: boolean;
}

export type WithdrawalStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface Withdrawal {
  id: string;
  riderId: string;
  amount: number;
  status: WithdrawalStatus;
  bankAccount: string;
  ifscCode: string;
  accountHolderName: string;
  transactionId?: string;
  failureReason?: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
}

export interface WithdrawalsResponse {
  withdrawals: Withdrawal[];
  page: number;
  limit: number;
  total: number;
}
