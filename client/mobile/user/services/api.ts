import axios, { AxiosInstance, AxiosError } from 'axios'
import { storage } from '../utils/storage'
import { ApiResponse } from '../types/api.types'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storage.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError<ApiResponse>) => {
        // Handle 401 - logout user
        if (error.response?.status === 401) {
          await storage.clear()
          // Navigate to login - will be handled by auth store
        }

        // Return formatted error
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Something went wrong'

        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  // Generic request methods
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params })
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data)
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data)
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch(url, data)
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url)
  }

  // File upload
  async uploadFile(file: File | Blob, type?: string): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file as any)
    if (type) formData.append('type', type)

    return this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export const api = new ApiService()
