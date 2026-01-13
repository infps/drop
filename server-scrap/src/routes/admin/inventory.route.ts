import { Hono } from 'hono'
import * as controller from '@/controllers/admin/inventory.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(), controller.list)
app.put('/:id', adminAuth(), controller.update)

export default app
