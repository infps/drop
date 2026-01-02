import { Hono } from 'hono'
import * as controller from '@/controllers/admin/orders.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.get('/:id', adminAuth(), controller.getById)
app.patch('/status', adminAuth(), controller.updateStatus)
app.post('/assign-rider', adminAuth(), controller.assign)
app.post('/cancel', adminAuth(), controller.cancel)

export default app
