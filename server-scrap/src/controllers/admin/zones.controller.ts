import type { Context } from 'hono'
import { listZones, updateSurge, toggleZone } from '@/db/actions/system/zone-ops.action'
import type { ZoneFilters } from '@/types/zone.types'

export async function list(c: Context<any>) {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 20

  const filters: ZoneFilters = {
    page,
    limit,
  }

  const { data, total } = await listZones(filters)
  return c.paginated(data, total, page, limit)
}

export async function surge(c: Context<any>) {
  const { zoneId, surgePricing } = await c.req.json()

  if (!zoneId || !surgePricing) {
    return c.sendError('Missing required fields', 400)
  }

  const zone = await updateSurge(zoneId, surgePricing)
  return c.success(zone, 'Surge pricing updated')
}

export async function toggle(c: Context<any>) {
  const { zoneId, isActive } = await c.req.json()

  if (!zoneId || isActive === undefined) {
    return c.sendError('Missing required fields', 400)
  }

  const zone = await toggleZone(zoneId, isActive)
  return c.success(zone, isActive ? 'Zone activated' : 'Zone deactivated')
}
