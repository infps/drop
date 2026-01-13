import { Hono } from 'hono'
import * as controller from '@/controllers/admin/finance.controller'
import { adminAuth } from '@/middleware/auth.middleware'

const app = new Hono()

app.get('/', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.overview)
app.get('/vendor-payouts', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.vendorPayouts)
app.get('/rider-payouts', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.riderPayouts)
app.get('/commissions', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.commissions)
app.get('/invoices', adminAuth(['SUPER_ADMIN', 'FINANCE']), controller.invoices)

export default app
