import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';
import { createNotification } from '../../lib/notifications';

const app = new Hono();

// Helper function to get status label
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Order Placed',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_PICKUP: 'Ready for Pickup',
    PICKED_UP: 'Picked Up',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };
  return labels[status] || status;
}

// GET /orders/:id - Fetch order details
app.get('/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const id = c.req.param('id');

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            logo: true,
            coverImage: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        rider: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            vehicleType: true,
            vehicleNumber: true,
            rating: true,
            currentLat: true,
            currentLng: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                isVeg: true,
                price: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      return notFoundResponse(c, 'Order not found');
    }

    // Verify ownership (user can see their own orders)
    if (user.type === 'user' && order.userId !== user.userId) {
      return unauthorizedResponse(c, 'Not authorized to view this order');
    }

    // Build timeline
    const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(order.status);

    const timeline = statusOrder.slice(0, -1).map((status, index) => {
      const historyEntry = order.statusHistory.find(h => h.status === status);
      return {
        status,
        label: getStatusLabel(status),
        time: historyEntry?.createdAt || null,
        completed: index <= currentIndex,
        isCurrent: index === currentIndex,
      };
    });

    return successResponse(c, {
      ...order,
      timeline,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return errorResponse(c, 'Failed to fetch order', 500);
  }
});

// PATCH /orders/:id - Update order status
app.patch('/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const id = c.req.param('id');
    const body = await c.req.json();
    const { status, cancellationReason, rating, review } = body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!order) {
      return notFoundResponse(c, 'Order not found');
    }

    // Handle cancellation
    if (status === 'CANCELLED') {
      // Only allow cancellation before pickup
      const cancelableStatuses = ['PENDING', 'CONFIRMED', 'PREPARING'];
      if (!cancelableStatuses.includes(order.status)) {
        return badRequestResponse(c, 'Order cannot be cancelled at this stage');
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          statusHistory: {
            create: {
              status: 'CANCELLED',
              note: cancellationReason || 'Cancelled by user',
            },
          },
        },
      });

      // Refund to wallet if paid
      if (order.paymentStatus === 'COMPLETED') {
        const wallet = await prisma.wallet.findUnique({
          where: { userId: order.userId },
        });

        if (wallet) {
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: order.total } },
          });

          await prisma.walletTransaction.create({
            data: {
              walletId: wallet.id,
              amount: order.total,
              type: 'REFUND',
              description: `Refund for cancelled order #${order.orderNumber}`,
              orderId: order.id,
            },
          });
        }

        await prisma.order.update({
          where: { id },
          data: { paymentStatus: 'REFUNDED' },
        });
      }

      // Send notification
      await createNotification(
        order.userId,
        'Order Cancelled',
        `Your order #${order.orderNumber} has been cancelled.`,
        'ORDER_UPDATE',
        { orderId: order.id }
      );

      return successResponse(
        c,
        { order: updatedOrder },
        'Order cancelled successfully'
      );
    }

    // Handle rating/review
    if (rating !== undefined && order.status === 'DELIVERED') {
      await prisma.review.create({
        data: {
          userId: order.userId,
          vendorId: order.vendorId,
          rating,
          comment: review,
        },
      });

      // Update vendor rating
      const vendorReviews = await prisma.review.aggregate({
        where: { vendorId: order.vendorId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.vendor.update({
        where: { id: order.vendorId },
        data: {
          rating: vendorReviews._avg.rating || 0,
          totalRatings: vendorReviews._count.rating,
        },
      });

      return successResponse(c, {}, 'Review submitted successfully');
    }

    // General status update (for riders/vendors/admins)
    if (status && ['rider', 'admin', 'vendor'].includes(user.type || '')) {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status,
          statusHistory: {
            create: {
              status,
              note: `Status updated to ${status}`,
            },
          },
        },
      });

      // Send notification to user
      await createNotification(
        order.userId,
        getStatusLabel(status),
        `Your order #${order.orderNumber} is now ${getStatusLabel(status).toLowerCase()}.`,
        'ORDER_UPDATE',
        { orderId: order.id }
      );

      return successResponse(
        c,
        { order: updatedOrder },
        'Order updated successfully'
      );
    }

    return badRequestResponse(c, 'Invalid update request');
  } catch (error) {
    console.error('Update order error:', error);
    return errorResponse(c, 'Failed to update order', 500);
  }
});

// PUT /orders/:id - Update order status (alias for PATCH)
app.put('/:id', async (c) => {
  return app.fetch(
    new Request(c.req.url, {
      method: 'PATCH',
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    })
  );
});

export default app;
