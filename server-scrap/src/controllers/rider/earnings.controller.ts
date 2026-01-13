import type { Context } from 'hono'
import {
  getEarningsSummary,
  getEarningsList,
  getRiderLifetimeStats,
} from '@/db/actions/rider/earnings.action'
import type { RiderPayload } from '@/middleware/auth.middleware'
import type { EarningsQueryParams } from '@/types/rider.types'

export async function getEarnings(c: Context) {
  const payload = c.get('jwtPayload') as RiderPayload
  const query = c.req.query() as EarningsQueryParams

  const period = query.period || 'today'
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))

  // Calculate start date based on period
  let startDate: Date
  const now = new Date()

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'all':
    default:
      startDate = new Date(0) // Epoch
      break
  }

  // Execute parallel queries
  const [summary, earnings, lifetime] = await Promise.all([
    getEarningsSummary(payload.id, startDate),
    getEarningsList(payload.id, startDate, page, limit),
    getRiderLifetimeStats(payload.id),
  ])

  return c.success({
    summary,
    earnings,
    lifetime,
  })
}
