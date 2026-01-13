import type { Context } from 'hono'
import { db } from '@/db'
import { products } from '@/db/schemas/vendor/product.model'
import { eq, and, or, like, sql } from 'drizzle-orm'

export async function getProducts(c: Context) {
  try {
    const { vendorId, categoryId, search, page = '1', limit = '20' } = c.req.query()

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const conditions: any[] = [eq(products.inStock, true)]

    if (vendorId) {
      conditions.push(eq(products.vendorId, vendorId))
    }

    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId))
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )!
      )
    }

    const results = await db.select()
      .from(products)
      .where(and(...conditions))
      .limit(limitNum)
      .offset(offset)

    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions))

    return c.json({
      status: 'success',
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(count),
        pages: Math.ceil(Number(count) / limitNum),
      },
    })
  } catch (error: any) {
    console.error('Get products error:', error)
    return c.json({ status: 'error', message: error.message || 'Failed to fetch products' }, 500)
  }
}

export async function getProductById(c: Context) {
  try {
    const { id } = c.req.param()

    const [product] = await db.select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.inStock, true)))
      .limit(1)

    if (!product) {
      return c.json({ status: 'error', message: 'Product not found' }, 404)
    }

    return c.json({ status: 'success', data: product })
  } catch (error: any) {
    console.error('Get product by ID error:', error)
    return c.json({ status: 'error', message: error.message || 'Failed to fetch product' }, 500)
  }
}
