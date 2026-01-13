// Rider API types

export interface UpdateLocationInput {
  latitude: number
  longitude: number
  isOnline?: boolean
}

export interface LocationStatusResponse {
  isOnline: boolean
  isAvailable: boolean
  currentLat: number | null
  currentLng: number | null
  assignedZone: string | null
  activeOrdersCount: number
}

export interface EarningsQueryParams {
  period?: 'today' | 'week' | 'month' | 'all'
  page?: number
  limit?: number
}

export interface EarningsSummary {
  baseEarning: number
  tips: number
  incentives: number
  penalties: number
  total: number
  deliveries: number
}

export interface EarningsListResponse {
  items: Array<{
    id: string
    riderId: string
    baseEarning: number
    tip: number
    incentive: number
    penalty: number
    total: number
    date: Date
  }>
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface LifetimeStats {
  totalDeliveries: number
  totalEarnings: number
  rating: number
}

export interface EarningsResponse {
  summary: EarningsSummary
  earnings: EarningsListResponse
  lifetime: LifetimeStats
}

export interface OrdersQueryParams {
  type?: 'available' | 'active' | 'completed'
  status?: string
  page?: number
  limit?: number
}

export interface OrderActionInput {
  orderId: string
  action: 'accept' | 'pickup' | 'deliver'
}

export interface OrderActionResponse {
  order: any
  earning?: number
  message: string
}
