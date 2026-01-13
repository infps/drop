import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'

export interface AdminPayload {
  id: string
  role: string
}

export interface RiderPayload {
  id: string
  type: 'rider'
}

// Base JWT validation
const jwtAuth = jwt({
  secret: process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long',
})

// Combined auth + optional role check
export const adminAuth = (roles?: string[]) =>
  createMiddleware(async (c, next) => {
    // Validate JWT first
    const authResult = await jwtAuth(c, async () => {})
    if (authResult) return authResult

    // Check roles if specified
    if (roles && roles.length > 0) {
      const payload = c.get('jwtPayload') as AdminPayload
      if (!roles.includes(payload.role)) {
        return c.json({ status: 'error', message: 'Forbidden' }, 403)
      }
    }

    await next()
  })

// Rider auth middleware
export const riderAuth = () =>
  createMiddleware(async (c, next) => {
    // Validate JWT first
    const authResult = await jwtAuth(c, async () => {})
    if (authResult) return authResult

    // Verify rider type
    const payload = c.get('jwtPayload') as RiderPayload
    if (payload.type !== 'rider') {
      return c.sendError('Rider authentication required', 401)
    }

    await next()
  })
