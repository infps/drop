import { Hono } from 'hono'
import * as controller from '@/controllers/admin/fleet.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/vehicles', adminAuth(), controller.vehicles)
app.get('/live', adminAuth(), controller.live)
app.get('/shifts', adminAuth(), controller.shifts)

export default app
