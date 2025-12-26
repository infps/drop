import { useState, useCallback } from 'react';
import { orderService } from '../services/order-service';
import { Order, OrderStatus } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(
    async (params?: { status?: OrderStatus; page?: number; limit?: number }) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await orderService.getOrders(params);
        setOrders(data.orders);
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchOrderById = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      setCurrentOrder(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await orderService.acceptOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to accept order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectOrder = useCallback(async (orderId: string, reason?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await orderService.rejectOrder(orderId, reason);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to reject order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markPreparing = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await orderService.markPreparing(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markReady = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await orderService.markReady(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    pagination,
    fetchOrders,
    fetchOrderById,
    acceptOrder,
    rejectOrder,
    markPreparing,
    markReady,
    clearError,
  };
};
