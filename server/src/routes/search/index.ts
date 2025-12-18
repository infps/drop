import { Hono } from 'hono';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  badRequestResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// GET /search - Search vendors and products by query string
app.get('/', async (c) => {
  try {
    const query = c.req.query('q');
    const type = c.req.query('type'); // 'vendors', 'products', 'all'
    const categoryId = c.req.query('categoryId');
    const isVeg = c.req.query('isVeg');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    const latitude = c.req.query('latitude');
    const longitude = c.req.query('longitude');

    const { page, limit, skip } = getPaginationParams(c);

    if (!query || query.trim().length === 0) {
      return badRequestResponse(c, 'Search query is required');
    }

    const searchQuery = query.trim();

    // Search vendors
    let vendors: any[] = [];
    let vendorsTotal = 0;

    if (type === 'vendors' || type === 'all' || !type) {
      const vendorWhere: Record<string, unknown> = {
        isActive: true,
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { address: { contains: searchQuery, mode: 'insensitive' } },
          { cuisineTypes: { has: searchQuery } },
        ],
      };

      vendorsTotal = await prisma.vendor.count({ where: vendorWhere });

      vendors = await prisma.vendor.findMany({
        where: vendorWhere,
        orderBy: { rating: 'desc' },
        skip: type === 'vendors' ? skip : 0,
        take: type === 'vendors' ? limit : 10,
        select: {
          id: true,
          name: true,
          logo: true,
          coverImage: true,
          description: true,
          rating: true,
          totalOrders: true,
          address: true,
          latitude: true,
          longitude: true,
          openingTime: true,
          closingTime: true,
          minimumOrder: true,
          avgDeliveryTime: true,
          isActive: true,
          cuisineTypes: true,
        },
      });

      // Calculate distance if user location provided
      if (latitude && longitude) {
        const userLat = parseFloat(latitude);
        const userLng = parseFloat(longitude);

        vendors = vendors.map((vendor) => {
          if (vendor.latitude && vendor.longitude) {
            const distance = calculateDistance(
              userLat,
              userLng,
              vendor.latitude,
              vendor.longitude
            );
            return { ...vendor, distance: parseFloat(distance.toFixed(2)) };
          }
          return { ...vendor, distance: null };
        });

        // Sort by distance
        vendors.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
    }

    // Search products
    let products: any[] = [];
    let productsTotal = 0;

    if (type === 'products' || type === 'all' || !type) {
      const productWhere: Record<string, unknown> = {
        inStock: true,
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { brand: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };

      if (categoryId) {
        productWhere.categoryId = categoryId;
      }

      if (isVeg === 'true') {
        productWhere.isVeg = true;
      } else if (isVeg === 'false') {
        productWhere.isVeg = false;
      }

      if (minPrice || maxPrice) {
        productWhere.price = {};
        if (minPrice) {
          (productWhere.price as Record<string, number>).gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          (productWhere.price as Record<string, number>).lte = parseFloat(maxPrice);
        }
      }

      productsTotal = await prisma.product.count({ where: productWhere });

      products = await prisma.product.findMany({
        where: productWhere,
        orderBy: { rating: 'desc' },
        skip: type === 'products' ? skip : 0,
        take: type === 'products' ? limit : 10,
        include: {
          vendor: {
            select: { id: true, name: true, logo: true, rating: true, isActive: true },
          },
          category: {
            select: { id: true, name: true, icon: true },
          },
        },
      });

      // Filter out products from inactive vendors
      products = products.filter((product) => product.vendor.isActive);
      productsTotal = products.length;
    }

    // Return based on type
    if (type === 'vendors') {
      return paginatedResponse(c, vendors, page, limit, vendorsTotal);
    } else if (type === 'products') {
      return paginatedResponse(c, products, page, limit, productsTotal);
    } else {
      // Return both
      return successResponse(c, {
        vendors: {
          data: vendors,
          total: vendorsTotal,
        },
        products: {
          data: products,
          total: productsTotal,
        },
        query: searchQuery,
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    return errorResponse(c, 'Failed to perform search', 500);
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default app;
