import { db } from '@/db'
import { vendors, orders } from '@/db/schema'
import { and, eq, like, count, desc, sum } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import type { VendorFilters } from '@/types/vendor.types'
import type { VendorType } from '@/types/enums'

export async function listVendors(filters: VendorFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []

  if (filters.type) {
    conditions.push(eq(vendors.type, filters.type as VendorType))
  }

  if (filters.isVerified !== undefined) {
    conditions.push(eq(vendors.isVerified, filters.isVerified))
  }

  if (filters.isActive !== undefined) {
    conditions.push(eq(vendors.isActive, filters.isActive))
  }

  if (filters.status === 'active') {
    conditions.push(eq(vendors.isActive, true))
    conditions.push(eq(vendors.isVerified, true))
  } else if (filters.status === 'pending') {
    conditions.push(eq(vendors.isVerified, false))
  } else if (filters.status === 'suspended') {
    conditions.push(eq(vendors.isActive, false))
  }

  if (filters.search) {
    conditions.push(like(vendors.name, `%${filters.search}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        id: vendors.id,
        name: vendors.name,
        type: vendors.type,
        logo: vendors.logo,
        rating: vendors.rating,
        isVerified: vendors.isVerified,
        isActive: vendors.isActive,
        commissionRate: vendors.commissionRate,
        createdAt: vendors.createdAt,
      })
      .from(vendors)
      .where(where)
      .orderBy(desc(vendors.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(vendors)
      .where(where),
  ])

  return { data, total: Number(total) }
}

export async function getVendorById(id: string) {
  const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1)

  if (!vendor) return null

  // Get stats
  const [stats] = await db
    .select({
      totalOrders: count(orders.id),
      revenue: sum(orders.total),
    })
    .from(orders)
    .where(eq(orders.vendorId, id))

  return {
    ...vendor,
    stats: {
      orders: stats?.totalOrders || 0,
      revenue: Number(stats?.revenue || 0),
    },
  }
}

export async function getVendorStats() {
  const [all] = await db.select({ count: count() }).from(vendors)

  const [active] = await db
    .select({ count: count() })
    .from(vendors)
    .where(and(eq(vendors.isActive, true), eq(vendors.isVerified, true)))

  const [pending] = await db
    .select({ count: count() })
    .from(vendors)
    .where(eq(vendors.isVerified, false))

  const [suspended] = await db
    .select({ count: count() })
    .from(vendors)
    .where(eq(vendors.isActive, false))

  return {
    total: all.count,
    active: active.count,
    pending: pending.count,
    suspended: suspended.count,
  }
}
