import { db } from '@/db'
import { orders, orderStatusHistory, wallets, walletTransactions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { OrderStatus } from '@/types/enums'

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  const [order] = await db
    .update(orders)
    .set({
      status: status as OrderStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  // Create status history
  await db.insert(orderStatusHistory).values({
    orderId,
    status: status as OrderStatus,
    note: note || null,
  })

  return order
}

export async function assignRider(orderId: string, riderId: string) {
  const [order] = await db
    .update(orders)
    .set({
      riderId,
      status: 'PICKED_UP',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  // Create status history
  await db.insert(orderStatusHistory).values({
    orderId,
    status: 'PICKED_UP',
    note: `Assigned to rider ${riderId}`,
  })

  return order
}

export async function cancelOrder(orderId: string, reason: string) {
  const [order] = await db
    .update(orders)
    .set({
      status: 'CANCELLED',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  // Create status history
  await db.insert(orderStatusHistory).values({
    orderId,
    status: 'CANCELLED',
    note: reason,
  })

  // Refund if payment completed
  if (order.paymentStatus === 'COMPLETED') {
    await db
      .update(orders)
      .set({ paymentStatus: 'REFUNDED' })
      .where(eq(orders.id, orderId))

    // Credit wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, order.userId))
      .limit(1)

    if (wallet) {
      await db
        .update(wallets)
        .set({ balance: Number(wallet.balance) + order.total })
        .where(eq(wallets.id, wallet.id))

      // Create transaction
      await db.insert(walletTransactions).values({
        walletId: wallet.id,
        type: 'REFUND',
        amount: order.total,
        description: `Refund for cancelled order ${order.orderNumber}`,
        orderId,
      })
    }
  }

  return order
}
