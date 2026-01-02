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
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export function success<T>(data: T, message?: string): SuccessResponse<T> {
  return { status: 'success', data, message }
}

export function error(message: string, err?: string): ErrorResponse {
  return { status: 'error', message, error: err }
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    status: 'success',
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}
