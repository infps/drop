import type { Context } from 'hono'
import { listUsers, verifyKYC, verifyAge } from '@/db/actions/user/user-ops.action'
import type { UserFilters } from '@/types/user.types'

export async function list(c: Context<any>) {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 10

  const filters: UserFilters = {
    page,
    limit,
    status: c.req.query('status') as any,
    search: c.req.query('search'),
  }

  const { data, total } = await listUsers(filters)
  return c.paginated(data, total, page, limit)
}

export async function updateKYC(c: Context<any>) {
  const { userId, verified } = await c.req.json()

  if (!userId || verified === undefined) {
    return c.sendError('Missing required fields', 400)
  }

  const user = await verifyKYC(userId, verified)
  return c.success(user, verified ? 'KYC verified' : 'KYC revoked')
}

export async function updateAge(c: Context<any>) {
  const { userId, verified } = await c.req.json()

  if (!userId || verified === undefined) {
    return c.sendError('Missing required fields', 400)
  }

  const user = await verifyAge(userId, verified)
  return c.success(user, verified ? 'Age verified' : 'Age verification revoked')
}
