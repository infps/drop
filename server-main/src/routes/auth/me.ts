import { Hono } from 'hono';
import { getCurrentUser, getFullUser, getFullRider, getFullAdmin, getFullVendor } from '../../lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from '../../middleware/response';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    let userData;

    switch (user.type) {
      case 'user':
        userData = await getFullUser(user.userId);
        break;
      case 'rider':
        userData = await getFullRider(user.userId);
        break;
      case 'admin':
        userData = await getFullAdmin(user.userId);
        break;
      case 'vendor':
        userData = await getFullVendor(user.userId);
        break;
      default:
        return errorResponse(
          c,
          'Invalid user type',
          400,
          'Bad Request'
        );
    }

    if (!userData) {
      return notFoundResponse(c, 'User not found');
    }

    return successResponse(c, {
      type: user.type,
      user: userData,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse(
      c,
      'Failed to get user data',
      500,
      'Internal Server Error'
    );
  }
});

export default app;
