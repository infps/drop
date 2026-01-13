import type { Context } from 'hono'
import { db } from '@/db'
import { vendors } from '@/db/schemas/vendor/vendor.model'
import { products } from '@/db/schemas/vendor/product.model'
import { eq, and, or, like, sql } from 'drizzle-orm'

export async function search(c: Context) {
  try {
    const { q, latitude, longitude, limit = '20' } = c.req.query()

    if (!q || q.trim().length === 0) {
      return c.json({ status: 'error', message: 'Search query is required' }, 400)
    }

    const searchQuery = q.trim()
    const limitNum = parseInt(limit)

    // Search vendors
    const vendorResults = await db.select({
      id: vendors.id,
      name: vendors.name,
      description: vendors.description,
      logo: vendors.logo,
      coverImage: vendors.coverImage,
      type: vendors.type,
      rating: vendors.rating,
      totalRatings: vendors.totalRatings,
      address: vendors.address,
      latitude: vendors.latitude,
      longitude: vendors.longitude,
      minimumOrder: vendors.minimumOrder,
      avgDeliveryTime: vendors.avgDeliveryTime,
    })
      .from(vendors)
      .where(
        and(
          eq(vendors.isActive, true),
          or(
            like(vendors.name, `%${searchQuery}%`),
            like(vendors.description, `%${searchQuery}%`)
          )!
        )
      )
      .limit(limitNum)

    // Search products
    const productResults = await db.select({
      id: products.id,
      vendorId: products.vendorId,
      categoryId: products.categoryId,
      name: products.name,
      description: products.description,
      price: products.price,
      images: products.images,
      isVeg: products.isVeg,
      inStock: products.inStock,
      rating: products.rating,
    })
      .from(products)
      .where(
        and(
          eq(products.inStock, true),
          or(
            like(products.name, `%${searchQuery}%`),
            like(products.description, `%${searchQuery}%`)
          )!
        )
      )
      .limit(limitNum)

    // Calculate distance if coordinates provided
    let vendorsWithDistance = vendorResults
    if (latitude && longitude) {
      const userLat = parseFloat(latitude)
      const userLon = parseFloat(longitude)

      vendorsWithDistance = vendorResults.map(vendor => {
        const distance = calculateDistance(
          userLat,
          userLon,
          vendor.latitude,
          vendor.longitude
        )
        return {
          ...vendor,
          distance,
          deliveryFee: calculateDeliveryFee(distance),
        }
      }).filter(v => v.distance <= 10) // Max 10km radius
        .sort((a, b) => a.distance - b.distance)
    } else {
      vendorsWithDistance = vendorResults.map(vendor => ({
        ...vendor,
        deliveryFee: 40,
      }))
    }

    return c.json({
      status: 'success',
      data: {
        vendors: vendorsWithDistance.slice(0, 10),
        products: productResults.slice(0, 10),
      },
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return c.json({ status: 'error', message: error.message || 'Search failed' }, 500)
  }
}

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

function calculateDeliveryFee(distance: number): number {
  const baseFee = 20
  const perKmRate = 8
  return Math.ceil(baseFee + (distance * perKmRate))
}
