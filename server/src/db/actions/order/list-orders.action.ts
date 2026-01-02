import { db } from '@/db'
import { orders, users, vendors, riders } from '@/db/schema'
import { and, eq, like, gte, lte, count, desc } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import type { OrderFilters } from '@/types/order.types'
import type { OrderStatus } from '@/types/enums'

export async function listOrders(filters: OrderFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []

  if (filters.status) {
    conditions.push(eq(orders.status, filters.status as OrderStatus))
  }

  if (filters.vendorId) {
    conditions.push(eq(orders.vendorId, filters.vendorId))
  }

  if (filters.userId) {
    conditions.push(eq(orders.userId, filters.userId))
  }

  if (filters.riderId) {
    conditions.push(eq(orders.riderId, filters.riderId))
  }

  if (filters.from) {
    conditions.push(gte(orders.createdAt, filters.from))
  }

  if (filters.to) {
    conditions.push(lte(orders.createdAt, filters.to))
  }

  if (filters.search) {
    conditions.push(like(orders.orderNumber, `%${filters.search}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        type: orders.type,
        subtotal: orders.subtotal,
        deliveryFee: orders.deliveryFee,
        total: orders.total,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        userId: orders.userId,
        vendorId: orders.vendorId,
        riderId: orders.riderId,
      })
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(orders)
      .where(where),
  ])

  return { data, total: Number(total) }
}

export async function getOrderById(id: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1)

  return order || null
}

export async function getOrderStats() {
  const [all] = await db.select({ count: count() }).from(orders)

  const [active] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.status, 'PENDING'),
        eq(orders.status, 'CONFIRMED'),
        eq(orders.status, 'PREPARING')
      )
    )

  const [delivered] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'DELIVERED'))

  const [cancelled] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'CANCELLED'))

  return {
    total: all.count,
    active: active.count,
    delivered: delivered.count,
    cancelled: cancelled.count,
  }
}
