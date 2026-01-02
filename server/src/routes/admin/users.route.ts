import { Hono } from 'hono'
import * as controller from '@/controllers/admin/users.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.patch('/verify-kyc', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.updateKYC)
app.patch('/verify-age', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.updateAge)

export default app
