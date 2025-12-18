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

// GET /user/addresses - List user addresses
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: { isDefault: 'desc' },
    });

    return successResponse(c, { addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    return errorResponse(c, 'Failed to fetch addresses', 500);
  }
});

// POST /user/addresses - Add new address
app.post('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { label, fullAddress, landmark, latitude, longitude, isDefault } = body;

    if (!label || !fullAddress || latitude === undefined || longitude === undefined) {
      return badRequestResponse(c, 'Missing required fields');
    }

    // If this is the default address, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address
    const addressCount = await prisma.address.count({
      where: { userId: user.userId },
    });

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        label,
        fullAddress,
        landmark,
        latitude,
        longitude,
        isDefault: isDefault || addressCount === 0, // Make first address default
      },
    });

    return successResponse(
      c,
      { address },
      'Address added successfully',
      201
    );
  } catch (error) {
    console.error('Add address error:', error);
    return errorResponse(c, 'Failed to add address', 500);
  }
});

// PUT /user/addresses/:id - Update address
app.put('/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const id = c.req.param('id');
    const body = await c.req.json();
    const { label, fullAddress, landmark, latitude, longitude, isDefault } = body;

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existingAddress) {
      return notFoundResponse(c, 'Address not found');
    }

    // If setting as default, unset other defaults
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        label,
        fullAddress,
        landmark,
        latitude,
        longitude,
        isDefault,
      },
    });

    return successResponse(
      c,
      { address },
      'Address updated successfully'
    );
  } catch (error) {
    console.error('Update address error:', error);
    return errorResponse(c, 'Failed to update address', 500);
  }
});

// DELETE /user/addresses/:id - Delete address
app.delete('/:id', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const id = c.req.param('id');

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    });

    if (!address) {
      return notFoundResponse(c, 'Address not found');
    }

    await prisma.address.delete({
      where: { id },
    });

    // If deleted address was default, make another one default
    if (address.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { userId: user.userId },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return successResponse(c, {}, 'Address deleted successfully');
  } catch (error) {
    console.error('Delete address error:', error);
    return errorResponse(c, 'Failed to delete address', 500);
  }
});

export default app;
