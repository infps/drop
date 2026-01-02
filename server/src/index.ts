import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { corsMiddleware } from '@/middleware/cors.middleware'
import { responseHelpers } from '@/middleware/response.middleware'
import { errorHandler } from '@/middleware/error.middleware'
import adminRoutes from '@/routes/admin'
import riderRoutes from '@/routes/rider'

const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', corsMiddleware)
app.use('*', responseHelpers)

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'DROP API v2' })
})

// Admin routes
app.route('/admin', adminRoutes)

// Rider routes
app.route('/rider', riderRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ status: 'error', message: 'Not found' }, 404)
})

// Error handler
app.onError(errorHandler)

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
