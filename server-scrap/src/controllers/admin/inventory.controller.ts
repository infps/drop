import type { Context } from 'hono'
import { listProducts, updateProduct } from '@/db/actions/vendor/inventory.action'
import type { ProductFilters } from '@/types/inventory.types'

export async function list(c: Context<any>) {
  const vendorId = c.req.query('vendorId')

  if (!vendorId) {
    return c.sendError('Vendor ID required', 400)
  }

  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 20

  const filters: ProductFilters = {
    vendorId,
    page,
    limit,
    category: c.req.query('category'),
    stockStatus: c.req.query('stockStatus') as any,
    search: c.req.query('search'),
    sortBy: c.req.query('sortBy'),
    sortOrder: c.req.query('sortOrder') as any,
  }

  const { data, total } = await listProducts(filters)
  return c.paginated(data, total, page, limit)
}

export async function update(c: Context<any>) {
  const id = c.req.param('id')
  const data = await c.req.json()

  const product = await updateProduct(id, data)
  return c.success(product, 'Product updated')
}
