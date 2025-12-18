import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  getPaginationParams,
  badRequestResponse,
  forbiddenResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// Middleware to check admin access
const requireAdmin = async (c: any, next: any) => {
  const user = await getCurrentUser(c);

  if (!user) {
    return unauthorizedResponse(c, 'Not authenticated');
  }

  if (user.type !== 'admin') {
    return forbiddenResponse(c, 'Admin access required');
  }

  await next();
};

// Apply admin middleware to all routes
app.use('*', requireAdmin);

// GET /admin/dashboard - Admin dashboard stats
app.get('/dashboard', async (c) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalRiders,
      totalVendors,
      totalOrders,
      todayOrders,
      activeOrders,
      totalRevenue,
      todayRevenue,
      platformFees,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.rider.count(),
      prisma.vendor.count(),
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.order.count({
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: today,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
        },
        _sum: {
          platformFee: true,
        },
      }),
    ]);

    // Get order status breakdown
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Get top vendors by revenue
    const topVendors = await prisma.order.groupBy({
      by: ['vendorId'],
      where: {
        paymentStatus: 'COMPLETED',
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 5,
    });

    // Enrich top vendors with vendor details
    const topVendorsWithDetails = await Promise.all(
      topVendors.map(async (v) => {
        const vendor = await prisma.vendor.findUnique({
          where: { id: v.vendorId },
          select: { id: true, name: true, logo: true, rating: true },
        });
        return {
          vendor,
          totalRevenue: v._sum.total || 0,
          totalOrders: v._count.id,
        };
      })
    );

    return successResponse(c, {
      overview: {
        totalUsers,
        totalRiders,
        totalVendors,
        totalOrders,
        todayOrders,
        activeOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        todayRevenue: todayRevenue._sum.total || 0,
        platformFees: platformFees._sum.platformFee || 0,
      },
      ordersByStatus: ordersByStatus.map((o) => ({
        status: o.status,
        count: o._count.status,
      })),
      topVendors: topVendorsWithDetails,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return errorResponse(c, 'Failed to fetch dashboard data', 500);
  }
});

// GET /admin/users - List all users with pagination
app.get('/users', async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const search = c.req.query('search') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phone: true,
          email: true,
          name: true,
          avatar: true,
          isKycVerified: true,
          isAgeVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(c, users, page, limit, total);
  } catch (error) {
    console.error('Admin users list error:', error);
    return errorResponse(c, 'Failed to fetch users', 500);
  }
});

// GET /admin/riders - List all riders with pagination and status
app.get('/riders', async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const status = c.req.query('status'); // online, offline, available, busy
    const search = c.req.query('search') || '';

    const where: any = {};

    if (status === 'online') {
      where.isOnline = true;
    } else if (status === 'offline') {
      where.isOnline = false;
    } else if (status === 'available') {
      where.isOnline = true;
      where.isAvailable = true;
    } else if (status === 'busy') {
      where.isOnline = true;
      where.isAvailable = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { vehicleNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [riders, total] = await Promise.all([
      prisma.rider.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          phone: true,
          email: true,
          name: true,
          avatar: true,
          documentVerified: true,
          policeVerified: true,
          alcoholAuthorized: true,
          vehicleType: true,
          vehicleNumber: true,
          isOnline: true,
          isAvailable: true,
          rating: true,
          totalDeliveries: true,
          totalEarnings: true,
          assignedZone: true,
          createdAt: true,
        },
      }),
      prisma.rider.count({ where }),
    ]);

    return paginatedResponse(c, riders, page, limit, total);
  } catch (error) {
    console.error('Admin riders list error:', error);
    return errorResponse(c, 'Failed to fetch riders', 500);
  }
});

// GET /admin/vendors - List all vendors with pagination
app.get('/vendors', async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const type = c.req.query('type'); // VendorType filter
    const status = c.req.query('status'); // active, inactive
    const search = c.req.query('search') || '';

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          coverImage: true,
          type: true,
          isVerified: true,
          isActive: true,
          rating: true,
          totalRatings: true,
          address: true,
          openingTime: true,
          closingTime: true,
          minimumOrder: true,
          avgDeliveryTime: true,
          commissionRate: true,
          createdAt: true,
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    return paginatedResponse(c, vendors, page, limit, total);
  } catch (error) {
    console.error('Admin vendors list error:', error);
    return errorResponse(c, 'Failed to fetch vendors', 500);
  }
});

// GET /admin/orders - List all orders with filters
app.get('/orders', async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const status = c.req.query('status');
    const paymentStatus = c.req.query('paymentStatus');
    const vendorId = c.req.query('vendorId');
    const riderId = c.req.query('riderId');
    const search = c.req.query('search') || '';

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (riderId) {
      where.riderId = riderId;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, phone: true, avatar: true },
          },
          vendor: {
            select: { id: true, name: true, logo: true },
          },
          rider: {
            select: { id: true, name: true, phone: true, vehicleNumber: true },
          },
          address: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return paginatedResponse(c, orders, page, limit, total);
  } catch (error) {
    console.error('Admin orders list error:', error);
    return errorResponse(c, 'Failed to fetch orders', 500);
  }
});

// GET /admin/payments - View payment/transaction history
app.get('/payments', async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const type = c.req.query('type'); // CREDIT, DEBIT, CASHBACK, REFUND, TOP_UP

    const where: any = {};

    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          wallet: {
            select: {
              userId: true,
              balance: true,
              user: {
                select: { id: true, name: true, phone: true },
              },
            },
          },
        },
      }),
      prisma.walletTransaction.count({ where }),
    ]);

    return paginatedResponse(c, transactions, page, limit, total);
  } catch (error) {
    console.error('Admin payments list error:', error);
    return errorResponse(c, 'Failed to fetch payment history', 500);
  }
});

// POST /admin/zones - Create delivery zone
app.post('/zones', async (c) => {
  try {
    const body = await c.req.json();
    const { name, polygon, isActive = true, surgePricing = 1, deliveryFee = 0 } = body;

    if (!name || !polygon) {
      return badRequestResponse(c, 'Name and polygon are required');
    }

    const zone = await prisma.zone.create({
      data: {
        name,
        polygon,
        isActive,
        surgePricing,
        deliveryFee,
      },
    });

    return successResponse(c, zone, 'Zone created successfully', 201);
  } catch (error) {
    console.error('Create zone error:', error);
    return errorResponse(c, 'Failed to create zone', 500);
  }
});

// GET /admin/zones - List zones
app.get('/zones', async (c) => {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { name: 'asc' },
    });

    return successResponse(c, zones);
  } catch (error) {
    console.error('List zones error:', error);
    return errorResponse(c, 'Failed to fetch zones', 500);
  }
});

// PUT /admin/zones/:id - Update zone
app.put('/zones/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, polygon, isActive, surgePricing, deliveryFee } = body;

    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      return errorResponse(c, 'Zone not found', 404, 'Not Found');
    }

    const updatedZone = await prisma.zone.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(polygon && { polygon }),
        ...(isActive !== undefined && { isActive }),
        ...(surgePricing !== undefined && { surgePricing }),
        ...(deliveryFee !== undefined && { deliveryFee }),
      },
    });

    return successResponse(c, updatedZone, 'Zone updated successfully');
  } catch (error) {
    console.error('Update zone error:', error);
    return errorResponse(c, 'Failed to update zone', 500);
  }
});

// DELETE /admin/zones/:id - Delete zone
app.delete('/zones/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const zone = await prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      return errorResponse(c, 'Zone not found', 404, 'Not Found');
    }

    await prisma.zone.delete({ where: { id } });

    return successResponse(c, { id }, 'Zone deleted successfully');
  } catch (error) {
    console.error('Delete zone error:', error);
    return errorResponse(c, 'Failed to delete zone', 500);
  }
});

export default app;
