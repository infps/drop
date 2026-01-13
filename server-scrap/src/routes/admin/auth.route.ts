import { Hono } from 'hono'
import * as controller from '@/controllers/admin/auth.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.post('/login', controller.login)
app.post('/logout', adminAuth(), controller.logout)
app.get('/me', adminAuth(), controller.me)

export default app
