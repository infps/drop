import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  getPaginationParams,
  notFoundResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// GET /notifications - Get user notifications with pagination
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const isRead = c.req.query('isRead');
    const type = c.req.query('type'); // 'ORDER_UPDATE', 'PROMOTION', 'ACCOUNT', 'SYSTEM'

    const { page, limit, skip } = getPaginationParams(c);

    // Build where clause
    const where: Record<string, unknown> = {
      userId: user.userId,
    };

    if (isRead === 'true') {
      where.isRead = true;
    } else if (isRead === 'false') {
      where.isRead = false;
    }

    if (type) {
      where.type = type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: user.userId,
          isRead: false,
        },
      }),
    ]);

    return paginatedResponse(
      c,
      {
        notifications,
        unreadCount,
      },
      page,
      limit,
      total
    );
  } catch (error) {
    console.error('Get notifications error:', error);
    return errorResponse(c, 'Failed to fetch notifications', 500);
  }
});

// POST /notifications/:id/read - Mark notification as read
app.post('/:id/read', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const notificationId = c.req.param('id');

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: user.userId,
      },
    });

    if (!notification) {
      return notFoundResponse(c, 'Notification not found');
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    // Get updated unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.userId,
        isRead: false,
      },
    });

    return successResponse(
      c,
      {
        notification: updatedNotification,
        unreadCount,
      },
      'Notification marked as read'
    );
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return errorResponse(c, 'Failed to mark notification as read', 500);
  }
});

// POST /notifications/read-all - Mark all notifications as read
app.post('/read-all', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    // Mark all as read
    await prisma.notification.updateMany({
      where: {
        userId: user.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return successResponse(c, null, 'All notifications marked as read');
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return errorResponse(c, 'Failed to mark all notifications as read', 500);
  }
});

// DELETE /notifications/:id - Delete a notification
app.delete('/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const notificationId = c.req.param('id');

    // Verify and delete notification
    const result = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: user.userId,
      },
    });

    if (result.count === 0) {
      return notFoundResponse(c, 'Notification not found');
    }

    return successResponse(c, null, 'Notification deleted');
  } catch (error) {
    console.error('Delete notification error:', error);
    return errorResponse(c, 'Failed to delete notification', 500);
  }
});

// DELETE /notifications - Clear all notifications
app.delete('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    // Delete all notifications for the user
    await prisma.notification.deleteMany({
      where: { userId: user.userId },
    });

    return successResponse(c, null, 'All notifications cleared');
  } catch (error) {
    console.error('Clear notifications error:', error);
    return errorResponse(c, 'Failed to clear notifications', 500);
  }
});

// GET /notifications/unread-count - Get unread notification count
app.get('/unread-count', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.userId,
        isRead: false,
      },
    });

    return successResponse(c, { unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    return errorResponse(c, 'Failed to get unread count', 500);
  }
});

export default app;
