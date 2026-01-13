export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function getPaginationParams(query: Record<string, any>): PaginationParams {
  const page = Number(query.page) || 1
  const limit = Math.min(Number(query.limit) || 20, 100) // Max 100
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}
