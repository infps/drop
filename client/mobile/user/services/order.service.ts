import { api } from './api'
import { Order } from '../types/order.types'
import { PaginatedResponse } from '../types/api.types'

export interface CreateOrderData {
  vendorId: string
  addressId: string
  items: Array<{
    productId: string
    quantity: number
    customizations?: Record<string, any>
    notes?: string
  }>
  paymentMethod: 'RAZORPAY' | 'COD' | 'WALLET'
  tip?: number
  deliveryInstructions?: string
  couponCode?: string
}

export const orderService = {
  async createOrder(data: CreateOrderData) {
    return api.post<{ order: Order; pointsEarned: number }>('/orders', data)
  },

  async getOrders(params?: {
    status?: string
    type?: 'active' | 'past'
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Order>> {
    return api.get('/orders', params)
  },

  async getOrderById(id: string) {
    return api.get<Order>(`/orders/${id}`)
  },

  async rateOrder(orderId: string, rating: {
    rating: number
    foodQuality?: number
    deliverySpeed?: number
    review?: string
    tags?: string[]
  }) {
    return api.post(`/orders/${orderId}/rate`, rating)
  },

  async reorder(orderId: string) {
    return api.post(`/orders/${orderId}/reorder`)
  },
}
