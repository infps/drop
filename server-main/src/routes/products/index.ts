import { Hono } from 'hono';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  notFoundResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// GET /products - Get products by category with pagination
app.get('/', async (c) => {
  try {
    const vendorId = c.req.query('vendorId');
    const categoryId = c.req.query('categoryId');
    const search = c.req.query('search');
    const minPrice = c.req.query('minPrice');
    const maxPrice = c.req.query('maxPrice');
    const isVeg = c.req.query('isVeg');
    const inStock = c.req.query('inStock');
    const sortBy = c.req.query('sortBy') || 'rating';

    const { page, limit, skip } = getPaginationParams(c);

    // Build where clause
    const where: Record<string, unknown> = {};

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        (where.price as Record<string, number>).gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        (where.price as Record<string, number>).lte = parseFloat(maxPrice);
      }
    }

    if (isVeg === 'true') {
      where.isVeg = true;
    } else if (isVeg === 'false') {
      where.isVeg = false;
    }

    if (inStock !== 'false') {
      where.inStock = true;
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Build orderBy
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        vendor: {
          select: { id: true, name: true, logo: true, rating: true },
        },
        category: {
          select: { id: true, name: true, icon: true },
        },
      },
    });

    return paginatedResponse(c, products, page, limit, total);
  } catch (error) {
    console.error('Products API error:', error);
    return errorResponse(c, 'Failed to fetch products', 500);
  }
});

// GET /products/:id - Get product details
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            logo: true,
            rating: true,
            address: true,
            latitude: true,
            longitude: true,
            minimumOrder: true,
            avgDeliveryTime: true,
            openingTime: true,
            closingTime: true,
            isActive: true,
            cuisineTypes: true,
          },
        },
        category: {
          select: { id: true, name: true, icon: true },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return notFoundResponse(c, 'Product not found');
    }

    // Get related products from the same vendor
    const relatedProducts = await prisma.product.findMany({
      where: {
        vendorId: product.vendorId,
        id: { not: product.id },
        inStock: true,
      },
      take: 6,
      orderBy: { rating: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        productId: id,
      },
      _count: {
        rating: true,
      },
    });

    const ratingStats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingDistribution.forEach((item) => {
      ratingStats[item.rating as keyof typeof ratingStats] = item._count.rating;
    });

    return successResponse(c, {
      ...product,
      totalReviews: product._count.reviews,
      ratingStats,
      relatedProducts,
    });
  } catch (error) {
    console.error('Product details API error:', error);
    return errorResponse(c, 'Failed to fetch product details', 500);
  }
});

export default app;
