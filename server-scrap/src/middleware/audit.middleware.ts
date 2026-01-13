import { createMiddleware } from 'hono/factory'
import { createAuditLog } from '@/db/actions/admin/audit-log.action'
import type { AdminPayload } from './auth.middleware'

// Extract entity from path: /admin/vendors/:id -> vendors
function extractEntity(path: string): string {
  const segments = path.split('/').filter(Boolean)
  // /admin/vendors/:id -> vendors
  // /admin/finance/vendor-payouts -> vendor-payouts
  if (segments.length >= 2) {
    return segments[1] // First segment after /admin
  }
  return 'unknown'
}

// Extract ID from path if exists
function extractId(path: string): string | null {
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  // Check if last segment looks like UUID or ID
  if (lastSegment && lastSegment.match(/^[a-f0-9-]{36}$/i)) {
    return lastSegment
  }
  return null
}

export const auditLog = createMiddleware(async (c, next) => {
  await next()

  const method = c.req.method
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return

  try {
    const payload = c.get('jwtPayload') as AdminPayload | undefined
    if (!payload) return // No auth, skip audit

    const path = c.req.path
    const entity = extractEntity(path)
    const entityId = extractId(path)

    // Try to get request body
    let body = null
    try {
      body = await c.req.json().catch(() => null)
    } catch {}

    // Non-blocking audit log creation
    createAuditLog({
      adminId: payload.id,
      action: method,
      entity,
      entityId: entityId || undefined,
      details: { path, body, status: c.res.status },
    }).catch((err) => console.error('[AUDIT ERROR]', err))
  } catch (err) {
    console.error('[AUDIT MIDDLEWARE ERROR]', err)
  }
})
