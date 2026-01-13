import { db } from '@/db'
import { riders, riderEarnings, orders } from '@/db/schema'
import { and, eq, like, count, desc, sum } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import { getStartOfDay } from '@/helpers/date.helper'
import type { RiderFilters } from '@/types/rider.types'

export async function listRiders(filters: RiderFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []

  if (filters.status === 'online') {
    conditions.push(eq(riders.isOnline, true))
    conditions.push(eq(riders.isAvailable, true))
  } else if (filters.status === 'busy') {
    conditions.push(eq(riders.isOnline, true))
    conditions.push(eq(riders.isAvailable, false))
  } else if (filters.status === 'offline') {
    conditions.push(eq(riders.isOnline, false))
  } else if (filters.status === 'pending') {
    conditions.push(eq(riders.documentVerified, false))
  }

  if (filters.zone) {
    conditions.push(eq(riders.assignedZone, filters.zone))
  }

  if (filters.search) {
    conditions.push(like(riders.name, `%${filters.search}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        id: riders.id,
        name: riders.name,
        phone: riders.phone,
        email: riders.email,
        isOnline: riders.isOnline,
        isAvailable: riders.isAvailable,
        rating: riders.rating,
        totalDeliveries: riders.totalDeliveries,
        totalEarnings: riders.totalEarnings,
        vehicleType: riders.vehicleType,
        vehicleNumber: riders.vehicleNumber,
        assignedZone: riders.assignedZone,
        documentVerified: riders.documentVerified,
        createdAt: riders.createdAt,
      })
      .from(riders)
      .where(where)
      .orderBy(desc(riders.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(riders)
      .where(where),
  ])

  return { data, total: Number(total) }
}

export async function approveRider(riderId: string) {
  const [rider] = await db
    .update(riders)
    .set({
      documentVerified: true,
      isAvailable: true,
    })
    .where(eq(riders.id, riderId))
    .returning()

  return rider
}

export async function suspendRider(riderId: string) {
  const [rider] = await db
    .update(riders)
    .set({
      isOnline: false,
      isAvailable: false,
    })
    .where(eq(riders.id, riderId))
    .returning()

  return rider
}

export async function getRiderEarnings(riderId: string) {
  const today = getStartOfDay()

  const [allTime] = await db
    .select({
      total: sum(riderEarnings.total),
      deliveries: count(),
    })
    .from(riderEarnings)
    .where(eq(riderEarnings.riderId, riderId))

  const [todayEarnings] = await db
    .select({
      total: sum(riderEarnings.total),
      deliveries: count(),
    })
    .from(riderEarnings)
    .where(
      and(
        eq(riderEarnings.riderId, riderId),
        eq(riderEarnings.date, today)
      )
    )

  return {
    riderId,
    totalEarnings: Number(allTime?.total || 0),
    totalDeliveries: allTime?.deliveries || 0,
    todayEarnings: Number(todayEarnings?.total || 0),
    todayDeliveries: todayEarnings?.deliveries || 0,
  }
}

export async function getRiderStats() {
  const [all] = await db.select({ count: count() }).from(riders)
  const [online] = await db.select({ count: count() }).from(riders).where(eq(riders.isOnline, true))
  const [busy] = await db.select({ count: count() }).from(riders).where(and(eq(riders.isOnline, true), eq(riders.isAvailable, false)))
  const [pending] = await db.select({ count: count() }).from(riders).where(eq(riders.documentVerified, false))

  return {
    total: all.count,
    online: online.count,
    busy: busy.count,
    pending: pending.count,
  }
}
