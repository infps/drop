import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse, ApiError } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add token to headers
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        // If token expired (401), try to refresh
        if (error.response?.status === 401) {
          await this.clearToken();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Get stored token from secure storage
   */
  async getToken(): Promise<string | null> {
    try {
      if (this.token) return this.token;
      this.token = await SecureStore.getItemAsync('rider_token');
      return this.token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Set token in secure storage
   */
  async setToken(token: string): Promise<void> {
    try {
      this.token = token;
      await SecureStore.setItemAsync('rider_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  /**
   * Clear token from secure storage
   */
  async clearToken(): Promise<void> {
    try {
      this.token = null;
      await SecureStore.deleteItemAsync('rider_token');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Format error response
   */
  private formatError(error: AxiosError<any>): ApiError {
    const errorMessage = error.response?.data?.message || error.message;
    const errorCode = error.response?.data?.code;
    const statusCode = error.response?.status;

    return {
      message: errorMessage,
      code: errorCode,
      statusCode: statusCode,
      details: error.response?.data,
    };
  }

  /**
   * Make GET request
   */
  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make POST request
   */
  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make PUT request
   */
  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make PATCH request
   */
  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make DELETE request
   */
  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
