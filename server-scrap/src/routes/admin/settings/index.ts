import { Hono } from 'hono'
import * as controller from '@/controllers/admin/settings.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/general', adminAuth(['SUPER_ADMIN']), controller.general)
app.get('/payments', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.payments)
app.get('/notifications', adminAuth(['SUPER_ADMIN']), controller.notifications)
app.get('/features', adminAuth(['SUPER_ADMIN']), controller.features)

export default app
