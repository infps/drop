export interface FinanceOverview {
  totalRevenue: number
  todayRevenue: number
  commission: number
  pendingPayouts: number
  growthPercentage: number
}

export interface VendorPayout {
  vendorId: string
  vendorName: string
  totalOrders: number
  totalRevenue: number
  commission: number
  payout: number
}

export interface RiderPayout {
  riderId: string
  riderName: string
  deliveries: number
  baseEarning: number
  tip: number
  incentive: number
  total: number
}
