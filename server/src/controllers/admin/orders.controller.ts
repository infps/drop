import type { Context } from 'hono'
import { listOrders, getOrderById } from '@/db/actions/order/list-orders.action'
import {
  updateOrderStatus,
  assignRider,
  cancelOrder,
} from '@/db/actions/order/order-ops.action'
import type { OrderFilters } from '@/types/order.types'

export async function list(c: Context<any>) {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 20

  const filters: OrderFilters = {
    page,
    limit,
    status: c.req.query('status'),
    vendorId: c.req.query('vendorId'),
    userId: c.req.query('userId'),
    riderId: c.req.query('riderId'),
    search: c.req.query('search'),
  }

  const { data, total } = await listOrders(filters)

  return c.paginated(data, total, page, limit)
}

export async function getById(c: Context<any>) {
  const id = c.req.param('id')
  const order = await getOrderById(id)

  if (!order) return c.sendError('Order not found', 404)

  return c.success(order)
}

export async function updateStatus(c: Context<any>) {
  const { orderId, status, note } = await c.req.json()

  if (!orderId || !status) {
    return c.sendError('Missing required fields', 400)
  }

  const order = await updateOrderStatus(orderId, status, note)
  return c.success(order, 'Order status updated')
}

export async function assign(c: Context<any>) {
  const { orderId, riderId } = await c.req.json()

  if (!orderId || !riderId) {
    return c.sendError('Missing required fields', 400)
  }

  const order = await assignRider(orderId, riderId)
  return c.success(order, 'Rider assigned')
}

export async function cancel(c: Context<any>) {
  const { orderId, reason } = await c.req.json()

  if (!orderId || !reason) {
    return c.sendError('Missing required fields', 400)
  }

  const order = await cancelOrder(orderId, reason)
  return c.success(order, 'Order cancelled and refunded')
}
