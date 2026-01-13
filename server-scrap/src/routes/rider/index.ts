import { Hono } from 'hono'
import { riderAuth } from '@/middleware/auth.middleware'
import location from './location.route'
import earnings from './earnings.route'
import orders from './orders.route'

const rider = new Hono()

// Apply rider auth to all routes
rider.use('*', riderAuth())

// Mount routes
rider.route('/location', location)
rider.route('/earnings', earnings)
rider.route('/orders', orders)

export default rider
