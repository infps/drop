import { Hono } from 'hono'
import * as controller from '@/controllers/admin/compliance.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/kyc', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.kyc)
app.get('/audit', adminAuth(['SUPER_ADMIN']), controller.audit)
app.get('/liquor', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.liquor)
app.get('/age', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.age)

export default app
