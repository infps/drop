import type { Context } from 'hono'
import {
  listRiders,
  approveRider,
  suspendRider,
  getRiderEarnings,
  getRiderStats,
} from '@/db/actions/rider/rider-ops.action'
import type { RiderFilters } from '@/types/rider.types'

export async function list(c: Context<any>) {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 10

  const filters: RiderFilters = {
    page,
    limit,
    status: c.req.query('status') as any,
    zone: c.req.query('zone'),
    search: c.req.query('search'),
  }

  const { data, total } = await listRiders(filters)
  return c.paginated(data, total, page, limit)
}

export async function approve(c: Context<any>) {
  const id = c.req.param('id')
  const rider = await approveRider(id)

  return c.success(rider, 'Rider approved')
}

export async function suspend(c: Context<any>) {
  const id = c.req.param('id')
  const rider = await suspendRider(id)

  return c.success(rider, 'Rider suspended')
}

export async function earnings(c: Context<any>) {
  const riderId = c.req.query('riderId')

  if (!riderId) {
    return c.sendError('Rider ID required', 400)
  }

  const data = await getRiderEarnings(riderId)
  return c.success(data)
}
