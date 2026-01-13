import type { Context } from 'hono'
import { listAuditLogs } from '@/db/actions/admin/audit-log.action'

export async function kyc(c: Context<any>) {
  // KYC verification requests
  return c.success([])
}

export async function audit(c: Context<any>) {
  const filters = {
    page: Number(c.req.query('page')) || 1,
    limit: Number(c.req.query('limit')) || 20,
  }

  const { data, total } = await listAuditLogs(filters)
  return c.paginated(data, total, filters.page, filters.limit)
}

export async function liquor(c: Context<any>) {
  // Liquor license management
  return c.success([])
}

export async function age(c: Context<any>) {
  // Age verification
  return c.success([])
}
