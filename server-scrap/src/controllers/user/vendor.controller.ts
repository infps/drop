import type { Context } from 'hono'
import { db } from '@/db'
import { vendors } from '@/db/schemas/vendor/vendor.model'
import { products } from '@/db/schemas/vendor/product.model'
import { eq, and, or, like, sql, gte } from 'drizzle-orm'

export async function getVendors(c: Context) {
  try {
    const { category, search, latitude, longitude, page = '1', limit = '20' } = c.req.query()

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    let query = db.select({
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
      isActive: vendors.isActive,
      openingTime: vendors.openingTime,
      closingTime: vendors.closingTime,
    }).from(vendors)

    // Filter by active vendors
    const conditions: any[] = [eq(vendors.isActive, true)]

    // Filter by category/type
    if (category) {
      conditions.push(eq(vendors.type, category as any))
    }

    // Search by name or description
    if (search) {
      conditions.push(
        or(
          like(vendors.name, `%${search}%`),
          like(vendors.description, `%${search}%`)
        )!
      )
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query
      .limit(limitNum)
      .offset(offset)

    // Calculate distance if coordinates provided
    let vendorsWithDistance = results
    if (latitude && longitude) {
      const userLat = parseFloat(latitude)
      const userLon = parseFloat(longitude)

      vendorsWithDistance = results.map(vendor => {
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
          isOpen: isVendorOpen(vendor.openingTime, vendor.closingTime),
        }
      }).filter(v => v.distance <= 10) // Max 10km radius
        .sort((a, b) => a.distance - b.distance)
    } else {
      vendorsWithDistance = results.map(vendor => ({
        ...vendor,
        deliveryFee: 40, // Default delivery fee
        isOpen: isVendorOpen(vendor.openingTime, vendor.closingTime),
      }))
    }

    // Get total count
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(vendors)
      .where(and(...conditions))

    return c.json({
      status: 'success',
      data: vendorsWithDistance,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(count),
        pages: Math.ceil(Number(count) / limitNum),
      },
    })
  } catch (error: any) {
    console.error('Get vendors error:', error)
    return c.json({ status: 'error', message: error.message || 'Failed to fetch vendors' }, 500)
  }
}

export async function getVendorById(c: Context) {
  try {
    const { id } = c.req.param()
    const { latitude, longitude } = c.req.query()

    const [vendor] = await db.select({
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
      isActive: vendors.isActive,
      openingTime: vendors.openingTime,
      closingTime: vendors.closingTime,
    })
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1)

    if (!vendor) {
      return c.json({ status: 'error', message: 'Vendor not found' }, 404)
    }

    let vendorWithDetails = { ...vendor, deliveryFee: 40 as number, distance: undefined as number | undefined, isOpen: false }

    if (latitude && longitude) {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        vendor.latitude,
        vendor.longitude
      )
      vendorWithDetails.distance = distance
      vendorWithDetails.deliveryFee = calculateDeliveryFee(distance)
    }

    vendorWithDetails.isOpen = isVendorOpen(vendor.openingTime, vendor.closingTime)

    return c.json({ status: 'success', data: vendorWithDetails })
  } catch (error: any) {
    console.error('Get vendor by ID error:', error)
    return c.json({ status: 'error', message: error.message || 'Failed to fetch vendor' }, 500)
  }
}

export async function getVendorProducts(c: Context) {
  try {
    const { id } = c.req.param()
    const { categoryId, search, page = '1', limit = '50' } = c.req.query()

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const conditions: any[] = [
      eq(products.vendorId, id),
      eq(products.inStock, true)
    ]

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
    console.error('Get vendor products error:', error)
    return c.json({ status: 'error', message: error.message || 'Failed to fetch products' }, 500)
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
  // Base fee + per km charge
  const baseFee = 20
  const perKmRate = 8
  return Math.ceil(baseFee + (distance * perKmRate))
}

function isVendorOpen(openingTime: string, closingTime: string): boolean {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  return currentTime >= openingTime && currentTime <= closingTime
}
