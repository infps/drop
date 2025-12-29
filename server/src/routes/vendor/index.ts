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
import registerRoute from './register';

const app = new Hono();

// Public routes (no auth required)
app.route('/register', registerRoute);

// GET /vendor/menu - Get vendor's menu items with categories
app.get('/menu', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const category = c.req.query('category');
    const search = c.req.query('search');
    const isAvailable = c.req.query('isAvailable');
    const { page, limit, skip } = getPaginationParams(c);

    // Get vendor
    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const where: any = { vendorId: vendor.id };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isAvailable !== null && isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { id: true, name: true, icon: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(c, products, page, limit, total);
  } catch (error) {
    console.error('Vendor menu GET error:', error);
    return errorResponse(c, 'Failed to fetch menu items', 500);
  }
});

// GET /vendor/menu/categories - Get categories for vendor
app.get('/menu/categories', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const categories = await prisma.category.findMany({
      where: { vendorId: user.userId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, icon: true },
    });

    return successResponse(c, categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(c, 'Failed to fetch categories', 500);
  }
});

// POST /vendor/menu/categories - Create category for vendor
app.post('/menu/categories', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const body = await c.req.json();
    const { name, icon } = body;

    if (!name) {
      return badRequestResponse(c, 'Category name is required');
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        vendorId: user.userId,
      },
      select: { id: true, name: true, icon: true },
    });

    return successResponse(c, category, 'Category created', 201);
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse(c, 'Failed to create category', 500);
  }
});

// POST /vendor/menu - Add menu item
app.post('/menu', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const body = await c.req.json();
    const {
      name,
      description,
      price,
      discountPrice,
      categoryId,
      images = [],
      isVeg = true,
      inStock = true,
    } = body;

    if (!name || !price) {
      return badRequestResponse(c, 'Name and price are required');
    }

    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        price,
        discountPrice,
        categoryId,
        images,
        isVeg,
        inStock,
      },
    });

    return successResponse(c, product, 'Menu item created successfully', 201);
  } catch (error) {
    console.error('Vendor menu POST error:', error);
    return errorResponse(c, 'Failed to create menu item', 500);
  }
});

// PUT /vendor/menu/:id - Update menu item
app.put('/menu/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    if (!id) {
      return badRequestResponse(c, 'Product ID is required');
    }

    // Verify product belongs to vendor
    const existingProduct = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existingProduct) {
      return notFoundResponse(c, 'Product not found');
    }

    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    return successResponse(c, product, 'Menu item updated successfully');
  } catch (error) {
    console.error('Vendor menu PUT error:', error);
    return errorResponse(c, 'Failed to update menu item', 500);
  }
});

// DELETE /vendor/menu/:id - Delete menu item
app.delete('/menu/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const id = c.req.param('id');

    if (!id) {
      return badRequestResponse(c, 'Product ID is required');
    }

    // Verify product belongs to vendor
    const existingProduct = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id },
    });

    if (!existingProduct) {
      return notFoundResponse(c, 'Product not found');
    }

    await prisma.product.delete({ where: { id } });

    return successResponse(c, null, 'Menu item deleted successfully');
  } catch (error) {
    console.error('Vendor menu DELETE error:', error);
    return errorResponse(c, 'Failed to delete menu item', 500);
  }
});

// GET /vendor/orders - Get vendor's orders
app.get('/orders', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const status = c.req.query('status');
    const type = c.req.query('type'); // 'active', 'completed'
    const { page, limit, skip } = getPaginationParams(c);

    const where: Record<string, unknown> = {
      vendorId: vendor.id,
    };

    if (status) {
      where.status = status;
    }

    if (type === 'active') {
      where.status = {
        in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
      };
    } else if (type === 'completed') {
      where.status = {
        in: ['DELIVERED', 'CANCELLED', 'REFUNDED'],
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, phone: true, avatar: true },
          },
          rider: {
            select: { id: true, name: true, phone: true, avatar: true, vehicleNumber: true },
          },
          address: true,
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: true, isVeg: true },
              },
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return paginatedResponse(c, orders, page, limit, total);
  } catch (error) {
    console.error('Vendor orders GET error:', error);
    return errorResponse(c, 'Failed to fetch orders', 500);
  }
});

// PATCH /vendor/orders/:id - Update order status
app.patch('/orders/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    const orderId = c.req.param('id');
    const body = await c.req.json();
    const { status, note } = body;

    if (!status) {
      return badRequestResponse(c, 'Status is required');
    }

    // Verify order belongs to vendor
    const order = await prisma.order.findFirst({
      where: { id: orderId, vendorId: vendor.id },
    });

    if (!order) {
      return notFoundResponse(c, 'Order not found');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note: note || `Order status updated to ${status}`,
          },
        },
      },
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return successResponse(c, updatedOrder, 'Order status updated successfully');
  } catch (error) {
    console.error('Vendor order status update error:', error);
    return errorResponse(c, 'Failed to update order status', 500);
  }
});

// GET /vendor/earnings - Get vendor earnings summary
app.get('/earnings', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id: user.userId },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
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
      vendorId: vendor.id,
      status: 'DELIVERED',
    };

    if (startDate) {
      where.deliveredAt = {
        gte: startDate,
      };
    }

    const results = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { deliveredAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          subtotal: true,
          platformFee: true,
          deliveredAt: true,
          items: {
            select: {
              quantity: true,
              price: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: {
          subtotal: true,
          platformFee: true,
        },
        _count: true,
      }),
    ]);
    const orders = results[0] as any;
    const total = results[1] as any;
    const summary = results[2] as any;

    // Calculate vendor earnings (subtotal - platform fee)
    const grossRevenue = summary._sum.subtotal || 0;
    const platformFees = summary._sum.platformFee || 0;
    const netEarnings = grossRevenue - platformFees;

    return paginatedResponse(
      c,
      orders.map((order: any) => ({
        ...order,
        summary: {
          grossRevenue,
          platformFees,
          netEarnings,
          totalOrders: summary._count,
        },
        vendor: {
          totalOrders: vendor.totalOrders,
          rating: vendor.rating,
        },
      })),
      page,
      limit,
      total
    );
  } catch (error) {
    console.error('Get vendor earnings error:', error);
    return errorResponse(c, 'Failed to fetch earnings', 500);
  }
});

// GET /vendor/profile - Get vendor profile
app.get('/profile', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: user.userId },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!vendor) {
      return notFoundResponse(c, 'Vendor not found');
    }

    // Get stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, activeOrders, todayRevenue] = await Promise.all([
      prisma.order.count({
        where: {
          vendorId: user.userId,
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.order.count({
        where: {
          vendorId: user.userId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'],
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          vendorId: user.userId,
          status: 'DELIVERED',
          deliveredAt: {
            gte: today,
          },
        },
        _sum: {
          subtotal: true,
        },
      }),
    ]);

    return successResponse(c, {
      ...vendor,
      stats: {
        todayOrders,
        activeOrders,
        todayRevenue: todayRevenue._sum.subtotal || 0,
        totalProducts: vendor._count.products,
        totalOrders: vendor._count.orders,
        totalReviews: vendor._count.reviews,
      },
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    return errorResponse(c, 'Failed to fetch profile', 500);
  }
});

// PUT /vendor/profile - Update vendor profile
app.put('/profile', async (c) => {
  try {
    const user = await getCurrentUser(c);
    if (!user || user.type !== 'vendor') {
      return unauthorizedResponse(c, 'Vendor access required');
    }

    const body = await c.req.json();
    const {
      name,
      logo,
      coverImage,
      description,
      phone,
      email,
      address,
      latitude,
      longitude,
      openingTime,
      closingTime,
      minimumOrder,
      avgDeliveryTime,
      isActive,
      cuisineTypes,
      bankAccount,
      ifscCode,
      panNumber,
      gstNumber,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (description !== undefined) updateData.description = description;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (openingTime !== undefined) updateData.openingTime = openingTime;
    if (closingTime !== undefined) updateData.closingTime = closingTime;
    if (minimumOrder !== undefined) updateData.minimumOrder = minimumOrder;
    if (avgDeliveryTime !== undefined) updateData.avgDeliveryTime = avgDeliveryTime;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (cuisineTypes !== undefined) updateData.cuisineTypes = cuisineTypes;
    if (bankAccount !== undefined) updateData.bankAccount = bankAccount;
    if (ifscCode !== undefined) updateData.ifscCode = ifscCode;
    if (panNumber !== undefined) updateData.panNumber = panNumber;
    if (gstNumber !== undefined) updateData.gstNumber = gstNumber;

    const vendor = await prisma.vendor.update({
      where: { id: user.userId },
      data: updateData,
    });

    return successResponse(c, vendor, 'Profile updated successfully');
  } catch (error) {
    console.error('Update vendor profile error:', error);
    return errorResponse(c, 'Failed to update profile', 500);
  }
});

export default app;
