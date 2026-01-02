import type { Context } from 'hono'
import {
  getOrdersList,
  getOrderById,
  assignOrderToRider,
  updateOrderStatus,
  markOrderDelivered,
  createRiderEarning,
  updateRiderStats,
} from '@/db/actions/rider/orders.action'
import type { RiderPayload } from '@/middleware/auth.middleware'
import type { OrdersQueryParams, OrderActionInput } from '@/types/rider.types'
import type { OrderStatus } from '@/db/schemas/enums'

export async function getOrders(c: Context) {
  const payload = c.get('jwtPayload') as RiderPayload
  const query = c.req.query() as OrdersQueryParams

  const type = query.type
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))

  let riderId: string | null = payload.id
  let statusFilter: OrderStatus[] | null = null

  // Type filtering
  if (type === 'available') {
    riderId = null
    statusFilter = ['READY_FOR_PICKUP']
  } else if (type === 'active') {
    statusFilter = ['PICKED_UP', 'OUT_FOR_DELIVERY']
  } else if (type === 'completed') {
    statusFilter = ['DELIVERED']
  } else if (query.status) {
    statusFilter = [query.status as OrderStatus]
  }

  const result = await getOrdersList(riderId, statusFilter, page, limit)

  return c.success(result)
}

export async function handleOrderAction(c: Context) {
  const payload = c.get('jwtPayload') as RiderPayload
  const body = await c.req.json<OrderActionInput>()

  const { orderId, action } = body

  if (!orderId || !action) {
    return c.sendError('Order ID and action are required', 400)
  }

  // Validate action before DB query
  const validActions = ['accept', 'pickup', 'deliver']
  if (!validActions.includes(action)) {
    return c.sendError('Invalid action', 400)
  }

  const order = await getOrderById(orderId)

  if (!order) {
    return c.sendError('Order not found', 404)
  }

  switch (action) {
    case 'accept':
      return await handleAcceptAction(c, payload, orderId, order)
    case 'pickup':
      return await handlePickupAction(c, payload, orderId, order)
    case 'deliver':
      return await handleDeliverAction(c, payload, orderId, order)
    default:
      return c.sendError('Invalid action', 400)
  }
}

async function handleAcceptAction(c: Context, payload: RiderPayload, orderId: string, order: any) {
  if (order.riderId) {
    return c.sendError('Order already assigned to a rider', 400)
  }

  if (order.status !== 'READY_FOR_PICKUP') {
    return c.sendError('Order is not ready for pickup', 400)
  }

  const updatedOrder = await assignOrderToRider(orderId, payload.id)

  return c.success({
    order: updatedOrder,
    message: 'Order accepted',
  })
}

async function handlePickupAction(c: Context, payload: RiderPayload, orderId: string, order: any) {
  if (order.riderId !== payload.id) {
    return c.sendError('Not authorized', 403)
  }

  const updatedOrder = await updateOrderStatus(orderId, 'OUT_FOR_DELIVERY')

  return c.success({
    order: updatedOrder,
    message: 'Order marked as out for delivery',
  })
}

async function handleDeliverAction(c: Context, payload: RiderPayload, orderId: string, order: any) {
  if (order.riderId !== payload.id) {
    return c.sendError('Not authorized', 403)
  }

  const updatedOrder = await markOrderDelivered(orderId)

  // Calculate earnings (80% of delivery fee)
  const baseEarning = order.deliveryFee * 0.8
  const tip = order.tip || 0
  const total = baseEarning + tip

  // Create earning record
  await createRiderEarning(payload.id, baseEarning, tip)

  // Update rider stats
  await updateRiderStats(payload.id, total)

  return c.success({
    order: updatedOrder,
    earning: total,
    message: 'Order delivered successfully',
  })
}
