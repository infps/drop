import type { Context } from 'hono'
import { updateRiderLocation, getRiderLocationStatus } from '@/db/actions/rider/location.action'
import type { RiderPayload } from '@/middleware/auth.middleware'
import type { UpdateLocationInput } from '@/types/rider.types'

export async function updateLocation(c: Context) {
  const payload = c.get('jwtPayload') as RiderPayload
  const body = await c.req.json<UpdateLocationInput>()

  const { latitude, longitude, isOnline } = body

  if (!latitude || !longitude) {
    return c.sendError('Location coordinates are required', 400)
  }

  const rider = await updateRiderLocation(payload.id, latitude, longitude, isOnline)

  return c.success({
    message: 'Location updated',
    isOnline: rider.isOnline,
  })
}

export async function getLocationStatus(c: Context) {
  const payload = c.get('jwtPayload') as RiderPayload

  const status = await getRiderLocationStatus(payload.id)

  if (!status) {
    return c.sendError('Rider not found', 404)
  }

  return c.success(status)
}
