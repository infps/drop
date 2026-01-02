import { Hono } from 'hono'
import * as controller from '@/controllers/admin/marketing.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/campaigns', adminAuth(['SUPER_ADMIN', 'MARKETING']), controller.campaigns)
app.get('/coupons', adminAuth(['SUPER_ADMIN', 'MARKETING']), controller.coupons)
app.get('/referrals', adminAuth(['SUPER_ADMIN', 'MARKETING']), controller.referrals)
app.post('/notifications', adminAuth(['SUPER_ADMIN', 'MARKETING']), controller.notifications)

export default app
