import { db } from '@/db'
import { orders, vendors, users, riders } from '@/db/schema'
import { eq, gte, count, sum, desc, and } from 'drizzle-orm'
import { getStartOfDay } from '@/helpers/date.helper'

export async function getDashboardStats() {
  const today = getStartOfDay()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Today's stats
  const [todayOrders] = await db
    .select({
      count: count(),
      total: sum(orders.total),
    })
    .from(orders)
    .where(gte(orders.createdAt, today))

  // Yesterday's stats for growth calc
  const [yesterdayOrders] = await db
    .select({
      count: count(),
      total: sum(orders.total),
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, yesterday),
        gte(orders.createdAt, today)
      )
    )

  // User stats
  const [todayUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(gte(users.createdAt, today))

  const [yesterdayUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        gte(users.createdAt, yesterday),
        gte(users.createdAt, today)
      )
    )

  // Rider stats
  const [onlineRiders] = await db
    .select({ count: count() })
    .from(riders)
    .where(eq(riders.isOnline, true))

  // Calculate growth percentages
  const revenueGrowth =
    yesterdayOrders.total && Number(yesterdayOrders.total) > 0
      ? ((Number(todayOrders.total || 0) - Number(yesterdayOrders.total)) /
          Number(yesterdayOrders.total)) *
        100
      : 0

  const ordersGrowth =
    yesterdayOrders.count > 0
      ? ((todayOrders.count - yesterdayOrders.count) / yesterdayOrders.count) * 100
      : 0

  const usersGrowth =
    yesterdayUsers.count > 0
      ? ((todayUsers.count - yesterdayUsers.count) / yesterdayUsers.count) * 100
      : 0

  return {
    todayRevenue: Number(todayOrders.total || 0),
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    totalOrders: todayOrders.count,
    ordersGrowth: Math.round(ordersGrowth * 10) / 10,
    activeUsers: todayUsers.count,
    usersGrowth: Math.round(usersGrowth * 10) / 10,
    onlineRiders: onlineRiders.count,
    ridersChange: 0, // TODO: track rider online/offline changes
  }
}

export async function getRecentOrders(limit: number = 10) {
  const data = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      userId: orders.userId,
      vendorId: orders.vendorId,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit)

  return data
}

export async function getOrderStatusSummary() {
  const [summary] = await db
    .select({
      status: orders.status,
      count: count(),
    })
    .from(orders)
    .groupBy(orders.status)

  return summary || {}
}

export async function getTopVendors(limit: number = 5) {
  const data = await db
    .select({
      id: vendors.id,
      name: vendors.name,
      rating: vendors.rating,
      orders: count(orders.id),
    })
    .from(vendors)
    .leftJoin(orders, eq(orders.vendorId, vendors.id))
    .groupBy(vendors.id, vendors.name, vendors.rating)
    .orderBy(desc(count(orders.id)))
    .limit(limit)

  return data
}
