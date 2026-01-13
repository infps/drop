import { and, eq, like, gte, lte, SQL } from 'drizzle-orm'

export function buildFilters(filters: Record<string, any>): SQL | undefined {
  const conditions: SQL[] = []

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue

    // Skip pagination params
    if (['page', 'limit', 'offset'].includes(key)) continue

    conditions.push(eq(key as any, value))
  }

  return conditions.length > 0 ? and(...conditions) : undefined
}

export function buildLikeFilter(column: any, value?: string): SQL | undefined {
  if (!value) return undefined
  return like(column, `%${value}%`)
}

export function buildDateRange(
  column: any,
  from?: Date,
  to?: Date
): SQL | undefined {
  const conditions: SQL[] = []
  if (from) conditions.push(gte(column, from))
  if (to) conditions.push(lte(column, to))
  return conditions.length > 0 ? and(...conditions) : undefined
}
