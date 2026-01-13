import { api } from './api'
import { Vendor, Product } from '../types/vendor.types'
import { PaginatedResponse } from '../types/api.types'

export const vendorService = {
  async getVendors(params?: {
    category?: string
    search?: string
    latitude?: number
    longitude?: number
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Vendor>> {
    return api.get('/vendors', params)
  },

  async getVendorById(id: string, params?: { latitude?: number, longitude?: number }) {
    return api.get<Vendor>(`/vendors/${id}`, params)
  },

  async getVendorMenu(vendorId: string, params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Product>> {
    return api.get(`/vendors/${vendorId}/products`, params)
  },

  async getProduct(productId: string) {
    return api.get<Product>(`/products/${productId}`)
  },

  async searchVendorsAndProducts(query: string, latitude?: number, longitude?: number) {
    return api.get('/search', { q: query, latitude, longitude })
  },
}
