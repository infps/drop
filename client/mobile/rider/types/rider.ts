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
  isOnline: boolean;
  isAvailable: boolean;
  currentLat?: number;
  currentLng?: number;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  assignedZone?: string;
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
    totalEarning: number;
    totalTips: number;
    totalIncentives: number;
    totalPenalties: number;
    totalDeliveries: number;
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
