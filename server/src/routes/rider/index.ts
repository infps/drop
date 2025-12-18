import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  getPaginationParams,
  badRequestResponse,
  notFoundResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// GET /rider/orders - Get rider's assigned orders
app.get('/orders', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const status = c.req.query('status');
    const type = c.req.query('type'); // 'available', 'active', 'completed'

    const { page, limit, skip } = getPaginationParams(c);

    // Build where clause
    const where: Record<string, unknown> = {};

    if (type === 'available') {
      // Orders ready for pickup without a rider
      where.status = 'READY_FOR_PICKUP';
      where.riderId = null;
    } else if (type === 'active') {
      // Rider's active orders
      where.riderId = user.userId;
      where.status = {
        in: ['PICKED_UP', 'OUT_FOR_DELIVERY'],
      };
    } else if (type === 'completed') {
      // Rider's completed orders
      where.riderId = user.userId;
      where.status = 'DELIVERED';
    } else {
      // All rider's orders
      where.riderId = user.userId;
    }

    if (status) {
      where.status = status;
    }

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
        user: {
          select: { name: true, phone: true },
        },
      },
    });

    return paginatedResponse(c, orders, page, limit, total);
  } catch (error) {
    console.error('Get rider orders error:', error);
    return errorResponse(c, 'Failed to fetch orders', 500);
  }
});

// POST /rider/orders/accept - Accept/update order
app.post('/orders/accept', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const body = await c.req.json();
    const { orderId, action } = body;

    if (!orderId || !action) {
      return badRequestResponse(c, 'Order ID and action are required');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return notFoundResponse(c, 'Order not found');
    }

    if (action === 'accept') {
      // Accept order
      if (order.riderId) {
        return badRequestResponse(c, 'Order already assigned to a rider');
      }

      if (order.status !== 'READY_FOR_PICKUP') {
        return badRequestResponse(c, 'Order is not ready for pickup');
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          riderId: user.userId,
          status: 'PICKED_UP',
          statusHistory: {
            create: {
              status: 'PICKED_UP',
              note: 'Order picked up by rider',
            },
          },
        },
      });

      return successResponse(
        c,
        {
          order: updatedOrder,
          message: 'Order accepted',
        },
        'Order accepted'
      );
    }

    if (action === 'pickup') {
      if (order.riderId !== user.userId) {
        return unauthorizedResponse(c, 'Not authorized');
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'OUT_FOR_DELIVERY',
          statusHistory: {
            create: {
              status: 'OUT_FOR_DELIVERY',
              note: 'Rider is on the way',
            },
          },
        },
      });

      return successResponse(
        c,
        {
          order: updatedOrder,
          message: 'Order marked as out for delivery',
        },
        'Order marked as out for delivery'
      );
    }

    if (action === 'deliver') {
      if (order.riderId !== user.userId) {
        return unauthorizedResponse(c, 'Not authorized');
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
          paymentStatus: order.paymentMethod === 'COD' ? 'COMPLETED' : order.paymentStatus,
          statusHistory: {
            create: {
              status: 'DELIVERED',
              note: 'Order delivered',
            },
          },
        },
      });

      // Calculate and add rider earnings
      const earning = order.deliveryFee * 0.8 + order.tip; // 80% of delivery fee + full tip

      await prisma.riderEarning.create({
        data: {
          riderId: user.userId,
          baseEarning: order.deliveryFee * 0.8,
          tip: order.tip,
          total: earning,
        },
      });

      // Update rider stats
      await prisma.rider.update({
        where: { id: user.userId },
        data: {
          totalDeliveries: { increment: 1 },
          totalEarnings: { increment: earning },
        },
      });

      return successResponse(
        c,
        {
          order: updatedOrder,
          earning,
          message: 'Order delivered successfully',
        },
        'Order delivered successfully'
      );
    }

    return badRequestResponse(c, 'Invalid action');
  } catch (error) {
    console.error('Rider order action error:', error);
    return errorResponse(c, 'Failed to update order', 500);
  }
});

// POST /rider/location - Update rider's real-time location
app.post('/location', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const body = await c.req.json();
    const { latitude, longitude, isOnline } = body;

    if (latitude === undefined || longitude === undefined) {
      return badRequestResponse(c, 'Location coordinates are required');
    }

    const updateData: Record<string, unknown> = {
      currentLat: latitude,
      currentLng: longitude,
    };

    if (isOnline !== undefined) {
      updateData.isOnline = isOnline;
    }

    const rider = await prisma.rider.update({
      where: { id: user.userId },
      data: updateData,
    });

    // Update location on active orders
    await prisma.order.updateMany({
      where: {
        riderId: user.userId,
        status: { in: ['PICKED_UP', 'OUT_FOR_DELIVERY'] },
      },
      data: {
        currentLat: latitude,
        currentLng: longitude,
      },
    });

    return successResponse(
      c,
      {
        message: 'Location updated',
        isOnline: rider.isOnline,
      },
      'Location updated'
    );
  } catch (error) {
    console.error('Update rider location error:', error);
    return errorResponse(c, 'Failed to update location', 500);
  }
});

// GET /rider/location - Get rider status
app.get('/location', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const rider = await prisma.rider.findUnique({
      where: { id: user.userId },
      select: {
        isOnline: true,
        isAvailable: true,
        currentLat: true,
        currentLng: true,
        assignedZone: true,
      },
    });

    // Get active orders count
    const activeOrdersCount = await prisma.order.count({
      where: {
        riderId: user.userId,
        status: { in: ['PICKED_UP', 'OUT_FOR_DELIVERY'] },
      },
    });

    return successResponse(c, {
      ...rider,
      activeOrdersCount,
    });
  } catch (error) {
    console.error('Get rider status error:', error);
    return errorResponse(c, 'Failed to get status', 500);
  }
});

// GET /rider/earnings - Get rider earnings summary
app.get('/earnings', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const period = c.req.query('period') || 'today'; // today, week, month, all
    const { page, limit, skip } = getPaginationParams(c);

    let startDate: Date | undefined;

    if (period === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const where: Record<string, unknown> = {
      riderId: user.userId,
    };

    if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    }

    const [earnings, total, summary] = await Promise.all([
      prisma.riderEarning.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.riderEarning.count({ where }),
      prisma.riderEarning.aggregate({
        where,
        _sum: {
          baseEarning: true,
          tip: true,
          total: true,
        },
        _count: true,
      }),
    ]);

    // Get rider stats
    const rider = await prisma.rider.findUnique({
      where: { id: user.userId },
      select: {
        totalDeliveries: true,
        totalEarnings: true,
        rating: true,
      },
    });

    return paginatedResponse(
      c,
      {
        earnings,
        summary: {
          baseEarning: summary._sum.baseEarning || 0,
          tips: summary._sum.tip || 0,
          total: summary._sum.total || 0,
          count: summary._count,
        },
        rider,
      },
      page,
      limit,
      total
    );
  } catch (error) {
    console.error('Get rider earnings error:', error);
    return errorResponse(c, 'Failed to fetch earnings', 500);
  }
});

// GET /rider/profile - Get rider profile
app.get('/profile', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const rider = await prisma.rider.findUnique({
      where: { id: user.userId },
      include: {
        _count: {
          select: {
            orders: true,
            earnings: true,
          },
        },
      },
    });

    if (!rider) {
      return notFoundResponse(c, 'Rider not found');
    }

    // Get stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayDeliveries, todayEarnings, activeOrders] = await Promise.all([
      prisma.order.count({
        where: {
          riderId: user.userId,
          status: 'DELIVERED',
          deliveredAt: {
            gte: today,
          },
        },
      }),
      prisma.riderEarning.aggregate({
        where: {
          riderId: user.userId,
          createdAt: {
            gte: today,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: {
          riderId: user.userId,
          status: { in: ['PICKED_UP', 'OUT_FOR_DELIVERY'] },
        },
      }),
    ]);

    return successResponse(c, {
      ...rider,
      stats: {
        todayDeliveries,
        todayEarnings: todayEarnings._sum.total || 0,
        activeOrders,
        totalDeliveries: rider._count.orders,
        totalEarningsRecords: rider._count.earnings,
      },
    });
  } catch (error) {
    console.error('Get rider profile error:', error);
    return errorResponse(c, 'Failed to fetch profile', 500);
  }
});

// PUT /rider/profile - Update rider profile
app.put('/profile', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user || user.type !== 'rider') {
      return unauthorizedResponse(c, 'Rider authentication required');
    }

    const body = await c.req.json();
    const {
      name,
      avatar,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      drivingLicense,
      isAvailable,
      bankAccount,
      ifscCode,
      panNumber,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
    if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber;
    if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel;
    if (drivingLicense !== undefined) updateData.drivingLicense = drivingLicense;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (bankAccount !== undefined) updateData.bankAccount = bankAccount;
    if (ifscCode !== undefined) updateData.ifscCode = ifscCode;
    if (panNumber !== undefined) updateData.panNumber = panNumber;

    const rider = await prisma.rider.update({
      where: { id: user.userId },
      data: updateData,
    });

    return successResponse(c, rider, 'Profile updated successfully');
  } catch (error) {
    console.error('Update rider profile error:', error);
    return errorResponse(c, 'Failed to update profile', 500);
  }
});

export default app;
