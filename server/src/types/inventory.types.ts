import type { FilterParams } from './api.types'

export interface ProductFilters extends FilterParams {
  vendorId: string
  category?: string
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductUpdate {
  name?: string
  price?: number
  discountPrice?: number
  inStock?: boolean
  stockQuantity?: number
}
