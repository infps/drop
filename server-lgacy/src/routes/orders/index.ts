import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  getPaginationParams,
  badRequestResponse
} from '../../middleware/response';
import prisma from '../../lib/prisma';
import { createNotification } from '../../lib/notifications';

const app = new Hono();

// GET /orders - Fetch paginated orders for current user with filters
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const status = c.req.query('status');
    const type = c.req.query('type'); // active or past

    const { page, limit, skip } = getPaginationParams(c);

    // Build where clause
    const where: Record<string, unknown> = {
      userId: user.userId,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (type === 'active') {
      where.status = {
        in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
      };
    } else if (type === 'past') {
      where.status = {
        in: ['DELIVERED', 'CANCELLED', 'REFUNDED'],
      };
    }

    // Get total count
    const total = await prisma.order.count({ where });

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        vendor: {
          select: { id: true, name: true, logo: true, address: true },
        },
        rider: {
          select: { id: true, name: true, phone: true, avatar: true, vehicleNumber: true, rating: true },
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
    });

    return paginatedResponse(c, orders, page, limit, total);
  } catch (error) {
    console.error('Orders API error:', error);
    return errorResponse(c, 'Failed to fetch orders', 500);
  }
});

// POST /orders - Create new order
app.post('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const {
      vendorId,
      addressId,
      items,
      paymentMethod,
      tip = 0,
      scheduledFor,
      deliveryInstructions,
      couponCode,
    } = body;

    // Validate required fields
    if (!vendorId || !items || items.length === 0 || !paymentMethod) {
      return badRequestResponse(c, 'Missing required fields');
    }

    // Verify vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor || !vendor.isActive) {
      return errorResponse(c, 'Vendor not found or inactive', 404, 'Not Found');
    }

    // Verify products and calculate prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.inStock) {
        return badRequestResponse(c, `Product ${item.productId} not available`);
      }

      const itemPrice = product.discountPrice || product.price;
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: itemPrice,
        customizations: item.customizations || null,
        notes: item.notes || null,
      });
    }

    // Check minimum order
    if (subtotal < vendor.minimumOrder) {
      return badRequestResponse(c, `Minimum order amount is ₹${vendor.minimumOrder}`);
    }

    // Calculate fees
    const deliveryFee = subtotal >= 199 ? 0 : 40; // Free delivery over ₹199
    const platformFee = Math.round(subtotal * 0.02); // 2% platform fee

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.promotion.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = Math.round(subtotal * coupon.discountValue / 100);
            if (coupon.maxDiscount) {
              discount = Math.min(discount, coupon.maxDiscount);
            }
          } else if (coupon.discountType === 'FLAT') {
            discount = coupon.discountValue;
          } else if (coupon.discountType === 'FREE_DELIVERY') {
            discount = deliveryFee;
          }

          // Increment coupon usage
          await prisma.promotion.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const total = subtotal + deliveryFee + platformFee + tip - discount;

    // Generate order number
    const orderNumber = `DRP${Date.now().toString(36).toUpperCase()}`;

    // Create order with transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        vendorId,
        addressId,
        status: 'PENDING',
        type: addressId ? 'DELIVERY' : 'PICKUP',
        subtotal,
        deliveryFee,
        platformFee,
        discount,
        tip,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        estimatedDelivery: new Date(Date.now() + vendor.avgDeliveryTime * 60 * 1000),
        deliveryInstructions,
        items: {
          create: orderItems,
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            note: 'Order placed',
          },
        },
      },
      include: {
        vendor: {
          select: { id: true, name: true, logo: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
        address: true,
      },
    });

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.userId },
    });

    // Award loyalty points (1 point per ₹10 spent)
    const pointsEarned = Math.floor(total / 10);
    if (pointsEarned > 0) {
      // Try to find or create loyalty points record
      const loyaltyRecord = await prisma.loyaltyPoints.findUnique({
        where: { userId: user.userId },
      });

      if (loyaltyRecord) {
        await prisma.loyaltyPoints.update({
          where: { userId: user.userId },
          data: {
            points: { increment: pointsEarned },
            lifetimePoints: { increment: pointsEarned },
          },
        });

        await prisma.pointsHistory.create({
          data: {
            loyaltyPointsId: loyaltyRecord.id,
            points: pointsEarned,
            type: 'EARNED',
            description: `Order #${orderNumber}`,
          },
        });
      } else {
        // Create new loyalty points record if it doesn't exist
        const newLoyaltyRecord = await prisma.loyaltyPoints.create({
          data: {
            userId: user.userId,
            points: pointsEarned,
            lifetimePoints: pointsEarned,
            tier: 'BRONZE',
          },
        });

        await prisma.pointsHistory.create({
          data: {
            loyaltyPointsId: newLoyaltyRecord.id,
            points: pointsEarned,
            type: 'EARNED',
            description: `Order #${orderNumber}`,
          },
        });
      }
    }

    // Send notification
    await createNotification(
      user.userId,
      'Order Placed!',
      `Your order #${orderNumber} has been placed successfully.`,
      'ORDER_UPDATE',
      { orderId: order.id }
    );

    return successResponse(
      c,
      {
        order,
        pointsEarned,
        message: 'Order placed successfully',
      },
      'Order placed successfully',
      201
    );
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse(c, 'Failed to create order', 500);
  }
});

export default app;
