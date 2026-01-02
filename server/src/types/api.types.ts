export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  message?: string
  error?: string
}

export interface SuccessResponse<T = any> {
  status: 'success'
  data: T
  message?: string
}

export interface ErrorResponse {
  status: 'error'
  message: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  status: 'success'
  data: T[]
  pagination: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface DateRangeParams {
  from?: Date
  to?: Date
  range?: 'today' | 'yesterday' | 'week' | 'month' | 'year'
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  search?: string
}

export interface FilterParams extends PaginationParams, SortParams, SearchParams {}
