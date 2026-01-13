import { Hono } from 'hono'
import * as controller from '@/controllers/admin/ai.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/assignment', adminAuth(['SUPER_ADMIN']), controller.assignment)
app.get('/fraud', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.fraud)
app.get('/demand', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.demand)
app.get('/personalization', adminAuth(['SUPER_ADMIN']), controller.personalization)

export default app
