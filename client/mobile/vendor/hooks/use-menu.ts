import { useState, useCallback } from 'react';
import { menuService } from '../services/menu-service';
import {
  MenuItem,
  Category,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '../types';

export const useMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchMenu = useCallback(
    async (params?: {
      category?: string;
      search?: string;
      inStock?: boolean;
      page?: number;
      limit?: number;
    }) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await menuService.getMenu(params);
        setItems(data.items);
        setCategories(data.categories);
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch menu');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await menuService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMenuItem = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await menuService.getMenuItem(itemId);
      setCurrentItem(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch menu item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMenuItem = useCallback(async (data: CreateMenuItemRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newItem = await menuService.createMenuItem(data);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      setError(err.message || 'Failed to create menu item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMenuItem = useCallback(async (data: UpdateMenuItemRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await menuService.updateMenuItem(data);
      setItems((prev) =>
        prev.map((item) => (item.id === data.id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update menu item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMenuItem = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await menuService.deleteMenuItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(
    async (itemId: string, inStock: boolean) => {
      try {
        setIsLoading(true);
        setError(null);
        const updated = await menuService.toggleAvailability(itemId, inStock);
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? updated : item))
        );
        return updated;
      } catch (err: any) {
        setError(err.message || 'Failed to toggle availability');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    categories,
    currentItem,
    isLoading,
    error,
    pagination,
    fetchMenu,
    fetchCategories,
    fetchMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    clearError,
  };
};
