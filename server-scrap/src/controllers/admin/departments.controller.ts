import type { Context } from 'hono'
import { listVendors } from '@/db/actions/vendor/list-vendors.action'

// Reuse vendor listing with type filter
export async function restaurants(c: Context<any>) {
  const { data, total } = await listVendors({
    type: 'RESTAURANT',
    page: Number(c.req.query('page')) || 1,
    limit: Number(c.req.query('limit')) || 20,
  })
  return c.paginated(data, total, 1, 20)
}

export async function grocery(c: Context<any>) {
  const { data, total } = await listVendors({ type: 'GROCERY', page: 1, limit: 20 })
  return c.paginated(data, total, 1, 20)
}

export async function wine(c: Context<any>) {
  const { data, total } = await listVendors({ type: 'WINE_SHOP', page: 1, limit: 20 })
  return c.paginated(data, total, 1, 20)
}

export async function dineIn(c: Context<any>) {
  const { data, total } = await listVendors({ type: 'RESTAURANT', page: 1, limit: 20 })
  return c.paginated(data, total, 1, 20)
}

export async function genie(c: Context<any>) {
  return c.success([]) // Genie orders
}

export async function hyperlocal(c: Context<any>) {
  return c.success([]) // All hyperlocal vendors
}

export async function pharmacy(c: Context<any>) {
  const { data, total } = await listVendors({ type: 'PHARMACY', page: 1, limit: 20 })
  return c.paginated(data, total, 1, 20)
}
