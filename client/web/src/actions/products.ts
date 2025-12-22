'use server';

import { API_BASE_URL } from '@/lib/utils';
import type { ApiResponse, Product, Vendor } from '@/types';

export async function getProducts(
  params?: {
    category?: string;
    vendor?: string;
    search?: string;
    limit?: number;
    page?: number;
  }
): Promise<ApiResponse<{ products: Product[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.vendor) queryParams.append('vendor', params.vendor);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch products',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        products: data.data?.products || [],
        total: data.data?.total || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function getProductById(productId: string): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch product',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function searchProducts(query: string): Promise<ApiResponse<{ products: Product[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to search products',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        products: data.data?.products || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function getVendorById(vendorId: string): Promise<ApiResponse<Vendor>> {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch vendor',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function getVendors(params?: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<ApiResponse<{ vendors: Vendor[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_BASE_URL}/search?${queryParams}&type=vendor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch vendors',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        vendors: data.data?.vendors || [],
        total: data.data?.total || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
