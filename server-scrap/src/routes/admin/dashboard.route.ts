import { Hono } from 'hono'
import * as controller from '@/controllers/admin/dashboard.controller'

const app = new Hono()

app.get('/', controller.getStats)

export default app
