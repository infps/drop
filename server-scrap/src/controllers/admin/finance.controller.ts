import type { Context } from 'hono'
import {
  getFinanceOverview,
  getVendorPayouts,
  getRiderPayouts,
} from '@/db/actions/finance/finance-ops.action'

export async function overview(c: Context<any>) {
  const data = await getFinanceOverview()
  return c.success(data)
}

export async function vendorPayouts(c: Context<any>) {
  const data = await getVendorPayouts()
  return c.success(data)
}

export async function riderPayouts(c: Context<any>) {
  const data = await getRiderPayouts()
  return c.success(data)
}

export async function commissions(c: Context<any>) {
  // Get commission rates by vendor type
  return c.success({
    RESTAURANT: 15,
    GROCERY: 12,
    WINE_SHOP: 18,
    PHARMACY: 10,
  })
}

export async function invoices(c: Context<any>) {
  // TODO: Generate invoices
  return c.success([])
}
