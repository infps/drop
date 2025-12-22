'use server';

import { API_BASE_URL } from '@/lib/utils';
import type { ApiResponse, Order, CartItem } from '@/types';

export async function createOrder(
  token: string,
  data: {
    vendorId: string;
    addressId: string;
    items: CartItem[];
    paymentMethod: 'RAZORPAY' | 'WALLET' | 'CASH_ON_DELIVERY';
    tip?: number;
  }
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to create order',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function getOrders(
  token: string,
  params?: {
    status?: string;
    limit?: number;
    page?: number;
  }
): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch orders',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        orders: data.data?.orders || [],
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

export async function getOrderById(
  token: string,
  orderId: string
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch order',
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

export async function updateOrderStatus(
  token: string,
  orderId: string,
  status: string
): Promise<ApiResponse<Order>> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to update order',
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

export async function getCart(token: string): Promise<ApiResponse<{ items: CartItem[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to fetch cart',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        items: data.data?.items || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function addToCart(
  token: string,
  data: {
    productId: string;
    quantity: number;
    selectedCustomization?: Record<string, string>;
    specialInstructions?: string;
  }
): Promise<ApiResponse<{ items: CartItem[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to add item to cart',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        items: result.data?.items || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function removeFromCart(
  token: string,
  itemId: string
): Promise<ApiResponse<{ items: CartItem[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to remove item from cart',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: {
        items: data.data?.items || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function clearCart(token: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to clear cart',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: { message: 'Cart cleared successfully' },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
