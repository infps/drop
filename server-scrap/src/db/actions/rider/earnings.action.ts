import { eq, sql, and, gte } from 'drizzle-orm'
import { db } from '@/db'
import { riderEarnings } from '@/db/schemas/rider/rider-earning.model'
import { riders } from '@/db/schemas/rider/rider.model'

export async function getEarningsSummary(riderId: string, startDate: Date) {
  const result = await db
    .select({
      baseEarning: sql<number>`COALESCE(SUM(${riderEarnings.baseEarning}), 0)`,
      tips: sql<number>`COALESCE(SUM(${riderEarnings.tip}), 0)`,
      incentives: sql<number>`COALESCE(SUM(${riderEarnings.incentive}), 0)`,
      penalties: sql<number>`COALESCE(SUM(${riderEarnings.penalty}), 0)`,
      total: sql<number>`COALESCE(SUM(${riderEarnings.total}), 0)`,
      deliveries: sql<number>`COUNT(*)`,
    })
    .from(riderEarnings)
    .where(
      and(
        eq(riderEarnings.riderId, riderId),
        gte(riderEarnings.date, startDate)
      )
    )

  return result[0]
}

export async function getEarningsList(
  riderId: string,
  startDate: Date,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit

  const items = await db
    .select()
    .from(riderEarnings)
    .where(
      and(
        eq(riderEarnings.riderId, riderId),
        gte(riderEarnings.date, startDate)
      )
    )
    .orderBy(sql`${riderEarnings.date} DESC`)
    .limit(limit)
    .offset(offset)

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(riderEarnings)
    .where(
      and(
        eq(riderEarnings.riderId, riderId),
        gte(riderEarnings.date, startDate)
      )
    )

  const total = Number(count)
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  }
}

export async function getRiderLifetimeStats(riderId: string) {
  const [rider] = await db
    .select({
      totalDeliveries: riders.totalDeliveries,
      totalEarnings: riders.totalEarnings,
      rating: riders.rating,
    })
    .from(riders)
    .where(eq(riders.id, riderId))
    .limit(1)

  return rider || { totalDeliveries: 0, totalEarnings: 0, rating: 0 }
}
