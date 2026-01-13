import { db } from '@/db'
import { orders, vendors, riderEarnings, riders } from '@/db/schema'
import { eq, sum, count, gte } from 'drizzle-orm'
import { getStartOfDay } from '@/helpers/date.helper'
import { calculateVendorPayout } from '@/helpers/calculation.helper'

export async function getFinanceOverview() {
  const today = getStartOfDay()

  const [todayRevenue] = await db
    .select({ total: sum(orders.total) })
    .from(orders)
    .where(gte(orders.createdAt, today))

  const [allRevenue] = await db.select({ total: sum(orders.total) }).from(orders)

  return {
    totalRevenue: Number(allRevenue?.total || 0),
    todayRevenue: Number(todayRevenue?.total || 0),
    commission: Number(allRevenue?.total || 0) * 0.15, // 15% avg
    pendingPayouts: 0, // TODO: calculate pending payouts
    growthPercentage: 0, // TODO: calculate growth
  }
}

export async function getVendorPayouts() {
  const vendorOrders = await db
    .select({
      vendorId: vendors.id,
      vendorName: vendors.name,
      commissionRate: vendors.commissionRate,
      totalRevenue: sum(orders.total),
      totalOrders: count(orders.id),
    })
    .from(vendors)
    .leftJoin(orders, eq(orders.vendorId, vendors.id))
    .groupBy(vendors.id, vendors.name, vendors.commissionRate)

  return vendorOrders.map((v) => ({
    vendorId: v.vendorId,
    vendorName: v.vendorName,
    totalOrders: v.totalOrders,
    totalRevenue: Number(v.totalRevenue || 0),
    commission: Number(v.totalRevenue || 0) * (v.commissionRate / 100),
    payout: calculateVendorPayout(Number(v.totalRevenue || 0), v.commissionRate),
  }))
}

export async function getRiderPayouts() {
  const riderData = await db
    .select({
      riderId: riders.id,
      riderName: riders.name,
      totalEarnings: sum(riderEarnings.total),
      baseEarning: sum(riderEarnings.baseEarning),
      tip: sum(riderEarnings.tip),
      incentive: sum(riderEarnings.incentive),
      deliveries: count(riderEarnings.id),
    })
    .from(riders)
    .leftJoin(riderEarnings, eq(riderEarnings.riderId, riders.id))
    .groupBy(riders.id, riders.name)

  return riderData.map((r) => ({
    riderId: r.riderId,
    riderName: r.riderName,
    deliveries: r.deliveries,
    baseEarning: Number(r.baseEarning || 0),
    tip: Number(r.tip || 0),
    incentive: Number(r.incentive || 0),
    total: Number(r.totalEarnings || 0),
  }))
}
