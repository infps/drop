import { Hono } from 'hono'
import * as controller from '@/controllers/admin/zones.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.patch('/surge', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.surge)
app.patch('/toggle', adminAuth(['SUPER_ADMIN']), controller.toggle)

export default app
