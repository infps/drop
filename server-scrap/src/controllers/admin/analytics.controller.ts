import type { Context } from 'hono'

export async function kpis(c: Context<any>) {
  // KPI metrics
  return c.success({
    avgOrderValue: 450,
    completionRate: 94.5,
    avgDeliveryTime: 32,
    satisfaction: 4.6,
  })
}

export async function trends(c: Context<any>) {
  // Trend data (placeholder)
  return c.success([])
}
