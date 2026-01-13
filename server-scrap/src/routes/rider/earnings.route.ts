import { Hono } from 'hono'
import { getEarnings } from '@/controllers/rider/earnings.controller'

const earnings = new Hono()

earnings.get('/', getEarnings)

export default earnings
