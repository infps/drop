import { Hono } from 'hono'
import * as controller from '@/controllers/admin/vendors.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.get('/:id', adminAuth(), controller.getById)
app.post('/', adminAuth(['SUPER_ADMIN']), controller.create)
app.put('/:id', adminAuth(['SUPER_ADMIN']), controller.update)
app.patch('/:id/approve', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.approve)
app.patch('/:id/reject', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.reject)
app.patch('/:id/suspend', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.suspend)
app.patch('/:id/activate', adminAuth(['SUPER_ADMIN', 'OPERATIONS']), controller.activate)
app.delete('/:id', adminAuth(['SUPER_ADMIN']), controller.remove)

export default app
