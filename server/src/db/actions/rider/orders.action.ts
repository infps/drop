import { eq, and, or, isNull, sql } from 'drizzle-orm'
import { db } from '@/db'
import { orders } from '@/db/schemas/order/order.model'
import { orderItems } from '@/db/schemas/order/order-item.model'
import { orderStatusHistory } from '@/db/schemas/order/order-status-history.model'
import { vendors } from '@/db/schemas/vendor/vendor.model'
import { addresses } from '@/db/schemas/user/address.model'
import { users } from '@/db/schemas/user/user.model'
import { riders } from '@/db/schemas/rider/rider.model'
import { riderEarnings } from '@/db/schemas/rider/rider-earning.model'
import { OrderStatus } from '@/db/schemas/enums'

export async function getOrdersList(
  riderId: string | null,
  statusFilter: OrderStatus[] | null,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit

  let whereConditions: any[] = []

  if (riderId === null) {
    // Available orders
    whereConditions.push(isNull(orders.riderId))
  } else {
    // Rider's orders
    whereConditions.push(eq(orders.riderId, riderId))
  }

  if (statusFilter && statusFilter.length > 0) {
    if (statusFilter.length === 1) {
      whereConditions.push(eq(orders.status, statusFilter[0]))
    } else {
      whereConditions.push(or(...statusFilter.map(s => eq(orders.status, s))))
    }
  }

  const items = await db
    .select()
    .from(orders)
    .leftJoin(vendors, eq(orders.vendorId, vendors.id))
    .leftJoin(addresses, eq(orders.addressId, addresses.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(and(...whereConditions))
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(limit)
    .offset(offset)

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(and(...whereConditions))

  const total = Number(count)
  const totalPages = Math.ceil(total / limit)

  // Get order items for each order
  const ordersWithItems = await Promise.all(
    items.map(async (item) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, item.orders.id))

      return {
        ...item.orders,
        vendor: item.vendors,
        address: item.addresses,
        user: { name: item.users?.name, phone: item.users?.phone },
        items,
      }
    })
  )

  return {
    items: ordersWithItems,
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  }
}

export async function getOrderById(orderId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .leftJoin(vendors, eq(orders.vendorId, vendors.id))
    .leftJoin(addresses, eq(orders.addressId, addresses.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order) return null

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))

  return {
    ...order.orders,
    vendor: order.vendors,
    address: order.addresses,
    user: { name: order.users?.name, phone: order.users?.phone },
    items,
  }
}

export async function assignOrderToRider(orderId: string, riderId: string) {
  const [updated] = await db
    .update(orders)
    .set({
      riderId,
      status: 'PICKED_UP',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  await createOrderStatusHistory(orderId, 'PICKED_UP')

  return updated
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const [updated] = await db
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  await createOrderStatusHistory(orderId, status)

  return updated
}

export async function markOrderDelivered(orderId: string) {
  const [updated] = await db
    .update(orders)
    .set({
      status: 'DELIVERED',
      deliveredAt: new Date(),
      paymentStatus: 'COMPLETED',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  await createOrderStatusHistory(orderId, 'DELIVERED')

  return updated
}

export async function createOrderStatusHistory(orderId: string, status: OrderStatus, note?: string) {
  await db.insert(orderStatusHistory).values({
    orderId,
    status,
    note,
  })
}

export async function createRiderEarning(
  riderId: string,
  baseEarning: number,
  tip: number,
  incentive: number = 0,
  penalty: number = 0
) {
  const total = baseEarning + tip + incentive - penalty

  const [earning] = await db
    .insert(riderEarnings)
    .values({
      riderId,
      baseEarning,
      tip,
      incentive,
      penalty,
      total,
      date: new Date(),
    })
    .returning()

  return earning
}

export async function updateRiderStats(riderId: string, earningAmount: number) {
  await db
    .update(riders)
    .set({
      totalDeliveries: sql`${riders.totalDeliveries} + 1`,
      totalEarnings: sql`${riders.totalEarnings} + ${earningAmount}`,
      updatedAt: new Date(),
    })
    .where(eq(riders.id, riderId))
}
