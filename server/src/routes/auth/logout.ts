import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { successResponse } from '../../middleware/response';

const app = new Hono();

app.post('/', async (c) => {
  try {
    // Clear all auth cookies
    deleteCookie(c, 'auth-token', { path: '/' });
    deleteCookie(c, 'rider-token', { path: '/' });
    deleteCookie(c, 'admin-token', { path: '/' });
    deleteCookie(c, 'vendor-token', { path: '/' });
    deleteCookie(c, 'token', { path: '/' });

    return successResponse(c, { message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Return success even if there's an error
    return successResponse(c, { message: 'Logged out' });
  }
});

export default app;
