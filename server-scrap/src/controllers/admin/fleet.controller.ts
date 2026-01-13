import type { Context } from 'hono'
import { db } from '@/db'
import { riders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function vehicles(c: Context<any>) {
  const data = await db
    .select({
      riderId: riders.id,
      riderName: riders.name,
      vehicleType: riders.vehicleType,
      vehicleNumber: riders.vehicleNumber,
      totalDeliveries: riders.totalDeliveries,
    })
    .from(riders)

  return c.success(data)
}

export async function live(c: Context<any>) {
  // Live tracking (polling endpoint)
  const onlineRiders = await db
    .select({
      riderId: riders.id,
      riderName: riders.name,
      lat: riders.currentLat,
      lng: riders.currentLng,
      isAvailable: riders.isAvailable,
    })
    .from(riders)
    .where(eq(riders.isOnline, true))

  return c.success(onlineRiders)
}

export async function shifts(c: Context<any>) {
  return c.success([])
}
