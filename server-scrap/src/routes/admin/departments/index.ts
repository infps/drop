import { Hono } from 'hono'
import * as controller from '@/controllers/admin/departments.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/restaurants', adminAuth(), controller.restaurants)
app.get('/grocery', adminAuth(), controller.grocery)
app.get('/wine', adminAuth(), controller.wine)
app.get('/dine-in', adminAuth(), controller.dineIn)
app.get('/genie', adminAuth(), controller.genie)
app.get('/hyperlocal', adminAuth(), controller.hyperlocal)
app.get('/pharmacy', adminAuth(), controller.pharmacy)

export default app
