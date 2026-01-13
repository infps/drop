import { Hono } from 'hono'
import { adminAuth } from '@/middleware/auth.middleware'
import { auditLog } from '@/middleware/audit.middleware'

// Import all routes
import auth from './auth.route'
import dashboard from './dashboard.route'
import vendors from './vendors.route'
import orders from './orders.route'
import users from './users.route'
import riders from './riders.route'
import finance from './finance'
import analytics from './analytics'
import zones from './zones.route'
import marketing from './marketing'
import fleet from './fleet'
import inventory from './inventory.route'
import departments from './departments'
import settings from './settings'
import ai from './ai'
import compliance from './compliance'

const app = new Hono()

// Auth routes (no middleware - handles own auth)
app.route('/auth', auth)

// Apply auth + audit to all protected routes
app.use('/*', adminAuth())
app.use('/*', auditLog)

// Core routes
app.route('/dashboard', dashboard)
app.route('/vendors', vendors)
app.route('/orders', orders)
app.route('/users', users)
app.route('/riders', riders)

// Additional routes
app.route('/finance', finance)
app.route('/analytics', analytics)
app.route('/zones', zones)
app.route('/marketing', marketing)
app.route('/fleet', fleet)
app.route('/inventory', inventory)
app.route('/departments', departments)
app.route('/settings', settings)
app.route('/ai', ai)
app.route('/compliance', compliance)

export default app
