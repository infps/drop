import { Hono } from 'hono'
import * as controller from '@/controllers/admin/riders.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.patch('/:id/approve', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.approve)
app.patch('/:id/suspend', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.suspend)
app.get('/earnings', adminAuth(), controller.earnings)

export default app
