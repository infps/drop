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

const app = new Hono();

// GET /user/profile - Get current user profile
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        wallet: true,
        subscription: true,
        loyaltyPoints: true,
        _count: {
          select: { orders: true, reviews: true },
        },
      },
    });

    if (!userData) {
      return notFoundResponse(c, 'User not found');
    }

    return successResponse(c, {
      ...userData,
      totalOrders: userData._count.orders,
      totalReviews: userData._count.reviews,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(c, 'Failed to fetch profile', 500);
  }
});

// PUT /user/profile - Update user profile
app.put('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const {
      name,
      email,
      avatar,
      dateOfBirth,
      preferredLanguage,
      cuisinePreferences,
      groceryBrands,
      alcoholPreferences,
    } = body;

    // Validate email uniqueness if changed
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: user.userId },
        },
      });

      if (existingUser) {
        return badRequestResponse(c, 'Email already in use');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        name,
        email,
        avatar,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        preferredLanguage,
        cuisinePreferences,
        groceryBrands,
        alcoholPreferences,
      },
      include: {
        addresses: true,
        wallet: true,
        subscription: true,
        loyaltyPoints: true,
      },
    });

    return successResponse(
      c,
      { user: updatedUser },
      'Profile updated successfully'
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(c, 'Failed to update profile', 500);
  }
});

export default app;
