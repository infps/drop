import { db } from '@/db'
import { products, categories } from '@/db/schema'
import { and, eq, like, lte, count, desc, asc } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import type { ProductFilters, ProductUpdate } from '@/types/inventory.types'

export async function listProducts(filters: ProductFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = [eq(products.vendorId, filters.vendorId)]

  if (filters.category) {
    conditions.push(eq(products.categoryId, filters.category))
  }

  if (filters.stockStatus === 'in_stock') {
    conditions.push(eq(products.inStock, true))
  } else if (filters.stockStatus === 'out_of_stock') {
    conditions.push(eq(products.inStock, false))
  } else if (filters.stockStatus === 'low_stock') {
    conditions.push(lte(products.stockQuantity, 10))
  }

  if (filters.search) {
    conditions.push(like(products.name, `%${filters.search}%`))
  }

  const where = and(...conditions)

  const sortColumn = filters.sortBy && filters.sortBy in products
    ? (products as any)[filters.sortBy]
    : products.createdAt
  const orderBy = filters.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)

  const [data, [{ total }]] = await Promise.all([
    db.select().from(products).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ total: count() }).from(products).where(where),
  ])

  return { data, total: Number(total) }
}

export async function updateProduct(productId: string, data: ProductUpdate) {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, productId))
    .returning()

  return product
}
