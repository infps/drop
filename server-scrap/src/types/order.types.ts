import type { FilterParams } from './api.types'

export interface OrderFilters extends FilterParams {
  status?: string
  vendorId?: string
  userId?: string
  riderId?: string
  from?: Date
  to?: Date
}

export interface OrderStatusUpdate {
  orderId: string
  status: string
  note?: string
}

export interface AssignRider {
  orderId: string
  riderId: string
}

export interface CancelOrder {
  orderId: string
  reason: string
}
