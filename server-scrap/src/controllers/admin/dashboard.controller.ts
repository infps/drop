import type { Context } from 'hono'
import {
  getDashboardStats,
  getRecentOrders,
  getOrderStatusSummary,
  getTopVendors,
} from '@/db/actions/analytics/dashboard-stats.action'

export async function getStats(c: Context<any>) {
  const [stats, recentOrders, statusSummary, topVendors] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(10),
    getOrderStatusSummary(),
    getTopVendors(5),
  ])

  return c.success({
    stats,
    recentOrders,
    statusSummary,
    topVendors,
  })
}
