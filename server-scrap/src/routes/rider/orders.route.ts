import { Hono } from 'hono'
import { getOrders, handleOrderAction } from '@/controllers/rider/orders.controller'

const orders = new Hono()

orders.get('/', getOrders)
orders.post('/', handleOrderAction)

export default orders
