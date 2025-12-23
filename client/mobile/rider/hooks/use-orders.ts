import { useState, useCallback } from 'react';
import { Order, OrdersResponse } from '../types';
import { orderService } from '../services/order-service';

export interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  page: number;
  total: number;
  hasMore: boolean;

  // Actions
  fetchAvailableOrders: (page?: number) => Promise<void>;
  fetchActiveOrders: (page?: number) => Promise<void>;
  fetchCompletedOrders: (page?: number) => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  confirmPickup: (orderId: string) => Promise<void>;
  startDelivery: (orderId: string) => Promise<void>;
  completeDelivery: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async (
    type: 'available' | 'active' | 'completed',
    pageNum: number = 1
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      let response: OrdersResponse;
      switch (type) {
        case 'available':
          response = await orderService.getAvailableOrders(pageNum);
          break;
        case 'active':
          response = await orderService.getActiveOrders(pageNum);
          break;
        case 'completed':
          response = await orderService.getCompletedOrders(pageNum);
          break;
        default:
          throw new Error('Invalid order type');
      }

      setOrders(response.orders);
      setPage(response.page);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableOrders = useCallback((pageNum: number = 1) => {
    return fetchOrders('available', pageNum);
  }, [fetchOrders]);

  const fetchActiveOrders = useCallback((pageNum: number = 1) => {
    return fetchOrders('active', pageNum);
  }, [fetchOrders]);

  const fetchCompletedOrders = useCallback((pageNum: number = 1) => {
    return fetchOrders('completed', pageNum);
  }, [fetchOrders]);

  const acceptOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderService.acceptOrder(orderId);
      // Refresh active orders
      await fetchActiveOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to accept order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders]);

  const confirmPickup = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderService.confirmPickup(orderId);
      // Refresh active orders
      await fetchActiveOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to confirm pickup');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders]);

  const startDelivery = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderService.startDelivery(orderId);
      // Refresh active orders
      await fetchActiveOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to start delivery');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders]);

  const completeDelivery = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderService.completeDelivery(orderId);
      // Refresh active and completed orders
      await fetchActiveOrders();
      await fetchCompletedOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to complete delivery');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders, fetchCompletedOrders]);

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await orderService.cancelOrder(orderId);
      // Refresh orders
      await fetchActiveOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchActiveOrders]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setOrders([]);
    setPage(1);
    setTotal(0);
    setError(null);
  }, []);

  return {
    orders,
    isLoading,
    error,
    page,
    total,
    hasMore: page * 10 < total,
    fetchAvailableOrders,
    fetchActiveOrders,
    fetchCompletedOrders,
    acceptOrder,
    confirmPickup,
    startDelivery,
    completeDelivery,
    cancelOrder,
    clearError,
    reset,
  };
};
