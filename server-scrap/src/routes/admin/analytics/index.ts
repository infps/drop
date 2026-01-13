import { Hono } from 'hono'
import * as controller from '@/controllers/admin/analytics.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/kpis', adminAuth(), controller.kpis)
app.get('/trends', adminAuth(), controller.trends)

export default app
