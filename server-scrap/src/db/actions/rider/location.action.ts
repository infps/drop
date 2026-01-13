import { eq, and, or } from 'drizzle-orm'
import { db } from '@/db'
import { riders } from '@/db/schemas/rider/rider.model'
import { orders } from '@/db/schemas/order/order.model'

export async function updateRiderLocation(
  riderId: string,
  latitude: number,
  longitude: number,
  isOnline?: boolean
) {
  const updateData: any = {
    currentLat: latitude,
    currentLng: longitude,
    updatedAt: new Date(),
  }

  if (isOnline !== undefined) {
    updateData.isOnline = isOnline
  }

  const [updatedRider] = await db
    .update(riders)
    .set(updateData)
    .where(eq(riders.id, riderId))
    .returning()

  // Sync location to active orders
  await db
    .update(orders)
    .set({
      currentLat: latitude,
      currentLng: longitude,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(orders.riderId, riderId),
        or(
          eq(orders.status, 'PICKED_UP'),
          eq(orders.status, 'OUT_FOR_DELIVERY')
        )
      )
    )

  return updatedRider
}

export async function getRiderLocationStatus(riderId: string) {
  const [rider] = await db
    .select({
      isOnline: riders.isOnline,
      isAvailable: riders.isAvailable,
      currentLat: riders.currentLat,
      currentLng: riders.currentLng,
      assignedZone: riders.assignedZone,
    })
    .from(riders)
    .where(eq(riders.id, riderId))
    .limit(1)

  if (!rider) return null

  // Count active orders
  const activeOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.riderId, riderId),
        or(
          eq(orders.status, 'PICKED_UP'),
          eq(orders.status, 'OUT_FOR_DELIVERY')
        )
      )
    )

  return {
    ...rider,
    activeOrdersCount: activeOrders.length,
  }
}
