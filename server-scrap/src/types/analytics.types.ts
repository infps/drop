export interface DashboardStats {
  todayRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  activeUsers: number
  usersGrowth: number
  onlineRiders: number
  ridersChange: number
}

export interface OrderStatusSummary {
  pending: number
  confirmed: number
  preparing: number
  picked_up: number
  out_for_delivery: number
  delivered: number
  cancelled: number
}

export interface TopVendor {
  id: string
  name: string
  orders: number
  rating: number
}

export interface RecentOrder {
  id: string
  orderNumber: string
  customer: string
  vendor: string
  total: number
  status: string
  time: Date
}

export interface KPIMetrics {
  avgOrderValue: number
  completionRate: number
  avgDeliveryTime: number
  satisfaction: number
}

export interface TrendData {
  date: string
  value: number
}
