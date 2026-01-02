import { db } from '@/db'
import { zones } from '@/db/schema'
import { eq, count } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import type { ZoneFilters } from '@/types/zone.types'

export async function listZones(filters: ZoneFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []
  if (filters.isActive !== undefined) {
    conditions.push(eq(zones.isActive, filters.isActive))
  }

  const where = conditions.length > 0 ? conditions[0] : undefined

  const [data, [{ total }]] = await Promise.all([
    db.select().from(zones).where(where).limit(limit).offset(offset),
    db.select({ total: count() }).from(zones).where(where),
  ])

  return { data, total: Number(total) }
}

export async function updateSurge(zoneId: string, surgePricing: number) {
  const [zone] = await db
    .update(zones)
    .set({ surgePricing })
    .where(eq(zones.id, zoneId))
    .returning()

  return zone
}

export async function toggleZone(zoneId: string, isActive: boolean) {
  const [zone] = await db
    .update(zones)
    .set({ isActive })
    .where(eq(zones.id, zoneId))
    .returning()

  return zone
}
