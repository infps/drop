import { apiClient } from './api';
import {
  Order,
  OrdersResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
} from '../types';

export const orderService = {
  async getOrders(params?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/vendor/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await apiClient.get<OrdersResponse>(url);
    return response.data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/vendor/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `/vendor/orders/${orderId}`,
      data
    );
    return response.data;
  },

  async acceptOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, { status: 'CONFIRMED' });
  },

  async rejectOrder(orderId: string, reason?: string): Promise<Order> {
    return this.updateOrderStatus(orderId, {
      status: 'CANCELLED',
      note: reason,
    });
  },

  async markPreparing(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, { status: 'PREPARING' });
  },

  async markReady(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, { status: 'READY_FOR_PICKUP' });
  },
};
