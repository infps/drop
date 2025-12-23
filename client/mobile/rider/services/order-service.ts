import { apiClient } from './api';
import {
  Order,
  OrdersResponse,
  OrderActionRequest,
  OrderActionResponse,
} from '../types';

export const orderService = {
  /**
   * Get available orders to accept
   */
  async getAvailableOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    const response = await apiClient.get<any>('/rider/orders', {
      params: {
        type: 'available',
        page,
        limit,
      },
    });
    // Map server's PaginatedResponse to client's OrdersResponse
    return {
      orders: response.data || [],
      page: response.pagination?.page || page,
      limit: response.pagination?.limit || limit,
      total: response.pagination?.total || 0,
    };
  },

  /**
   * Get active orders for rider
   */
  async getActiveOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    const response = await apiClient.get<any>('/rider/orders', {
      params: {
        type: 'active',
        page,
        limit,
      },
    });
    // Map server's PaginatedResponse to client's OrdersResponse
    return {
      orders: response.data || [],
      page: response.pagination?.page || page,
      limit: response.pagination?.limit || limit,
      total: response.pagination?.total || 0,
    };
  },

  /**
   * Get completed orders (history)
   */
  async getCompletedOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    const response = await apiClient.get<any>('/rider/orders', {
      params: {
        type: 'completed',
        page,
        limit,
      },
    });
    // Map server's PaginatedResponse to client's OrdersResponse
    return {
      orders: response.data || [],
      page: response.pagination?.page || page,
      limit: response.pagination?.limit || limit,
      total: response.pagination?.total || 0,
    };
  },

  /**
   * Get single order details
   */
  async getOrderDetails(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Accept an available order
   */
  async acceptOrder(orderId: string): Promise<OrderActionResponse> {
    const response = await apiClient.post<OrderActionResponse>(
      '/rider/orders/accept',
      {
        orderId,
        action: 'accept',
      }
    );
    return response.data;
  },

  /**
   * Confirm pickup from vendor (ASSIGNED -> PICKED_UP)
   */
  async confirmPickup(orderId: string): Promise<OrderActionResponse> {
    const response = await apiClient.post<OrderActionResponse>(
      '/rider/orders/accept',
      {
        orderId,
        action: 'pickup',
      }
    );
    return response.data;
  },

  /**
   * Start delivery to customer (PICKED_UP -> OUT_FOR_DELIVERY)
   */
  async startDelivery(orderId: string): Promise<OrderActionResponse> {
    const response = await apiClient.post<OrderActionResponse>(
      '/rider/orders/accept',
      {
        orderId,
        action: 'start_delivery',
      }
    );
    return response.data;
  },

  /**
   * Complete delivery to customer (OUT_FOR_DELIVERY -> DELIVERED)
   */
  async completeDelivery(orderId: string): Promise<OrderActionResponse> {
    const response = await apiClient.post<OrderActionResponse>(
      '/rider/orders/accept',
      {
        orderId,
        action: 'deliver',
      }
    );
    return response.data;
  },

  /**
   * Cancel an accepted order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<OrderActionResponse> {
    const response = await apiClient.post<OrderActionResponse>(
      `/rider/orders/${orderId}/cancel`,
      { reason }
    );
    return response.data;
  },

  /**
   * Filter orders by parameters
   */
  async filterOrders(filters: {
    type?: 'available' | 'active' | 'completed';
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<OrdersResponse> {
    const response = await apiClient.get<any>('/rider/orders', {
      params: filters,
    });
    // Map server's PaginatedResponse to client's OrdersResponse
    return {
      orders: response.data || [],
      page: response.pagination?.page || filters.page || 1,
      limit: response.pagination?.limit || filters.limit || 10,
      total: response.pagination?.total || 0,
    };
  },
};
