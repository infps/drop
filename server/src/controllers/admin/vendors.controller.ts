import type { Context } from 'hono'
import {
  listVendors,
  getVendorById,
  getVendorStats,
} from '@/db/actions/vendor/list-vendors.action'
import {
  createVendor,
  approveVendor,
  rejectVendor,
  suspendVendor,
  activateVendor,
  updateVendor,
  deleteVendor,
} from '@/db/actions/vendor/vendor-ops.action'
import type { VendorFilters, VendorCreate } from '@/types/vendor.types'

export async function list(c: Context<any>) {
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 12

  const filters: VendorFilters = {
    page,
    limit,
    type: c.req.query('type'),
    status: c.req.query('status') as any,
    search: c.req.query('search'),
  }

  const { data, total } = await listVendors(filters)
  return c.paginated(data, total, page, limit)
}

export async function getById(c: Context<any>) {
  const id = c.req.param('id')
  const vendor = await getVendorById(id)

  if (!vendor) return c.sendError('Vendor not found', 404)

  return c.success(vendor)
}

export async function create(c: Context<any>) {
  const data: VendorCreate = await c.req.json()

  // Validate required fields
  if (!data.name || !data.email || !data.type) {
    return c.sendError('Missing required fields', 400)
  }

  const vendor = await createVendor(data)
  return c.success(vendor, 'Vendor created')
}

export async function update(c: Context<any>) {
  const id = c.req.param('id')
  const data = await c.req.json()

  const vendor = await updateVendor(id, data)
  if (!vendor) return c.sendError('Vendor not found', 404)

  return c.success(vendor, 'Vendor updated')
}

export async function approve(c: Context<any>) {
  const id = c.req.param('id')
  const vendor = await approveVendor(id)

  return c.success(vendor, 'Vendor approved')
}

export async function reject(c: Context<any>) {
  const id = c.req.param('id')
  const vendor = await rejectVendor(id)

  return c.success(vendor, 'Vendor rejected')
}

export async function suspend(c: Context<any>) {
  const id = c.req.param('id')
  const vendor = await suspendVendor(id)

  return c.success(vendor, 'Vendor suspended')
}

export async function activate(c: Context<any>) {
  const id = c.req.param('id')
  const vendor = await activateVendor(id)

  return c.success(vendor, 'Vendor activated')
}

export async function remove(c: Context<any>) {
  const id = c.req.param('id')
  await deleteVendor(id)

  return c.success(null, 'Vendor deleted')
}
