import { apiClient } from './api';
import {
  MenuItem,
  MenuResponse,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  Category,
} from '../types';

export const menuService = {
  async getMenu(params?: {
    category?: string;
    search?: string;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }): Promise<MenuResponse> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.inStock !== undefined)
      queryParams.append('inStock', params.inStock.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `/vendor/menu${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await apiClient.get<MenuResponse>(url);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/vendor/menu/categories');
    return response.data;
  },

  async getMenuItem(itemId: string): Promise<MenuItem> {
    const response = await apiClient.get<MenuItem>(`/vendor/menu/${itemId}`);
    return response.data;
  },

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await apiClient.post<MenuItem>('/vendor/menu', data);
    return response.data;
  },

  async updateMenuItem(data: UpdateMenuItemRequest): Promise<MenuItem> {
    const { id, ...updateData } = data;
    const response = await apiClient.put<MenuItem>(
      `/vendor/menu/${id}`,
      updateData
    );
    return response.data;
  },

  async deleteMenuItem(itemId: string): Promise<void> {
    await apiClient.delete(`/vendor/menu/${itemId}`);
  },

  async toggleAvailability(itemId: string, inStock: boolean): Promise<MenuItem> {
    const response = await apiClient.patch<MenuItem>(`/vendor/menu/${itemId}`, {
      inStock,
    });
    return response.data;
  },
};
