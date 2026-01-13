import { Hono } from 'hono';
import sendOtpRoute from './send-otp';
import verifyOtpRoute from './verify-otp';
import riderRegisterRoute from './rider-register';
import adminLoginRoute from './admin-login';
import meRoute from './me';
import logoutRoute from './logout';
import { getCurrentUser, verifyToken } from '../../lib/auth';
import { successResponse } from '../../middleware/response';

const app = new Hono();

// Auth routes
app.route('/send-otp', sendOtpRoute);
app.route('/verify-otp', verifyOtpRoute);
app.route('/rider-register', riderRegisterRoute);
app.route('/admin-login', adminLoginRoute);
app.route('/me', meRoute);
app.route('/logout', logoutRoute);

// Debug endpoint - check token
app.get('/debug/token', async (c) => {
  const authHeader = c.req.header('Authorization');
  const user = await getCurrentUser(c);

  let tokenPayload = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    tokenPayload = await verifyToken(token);
  }

  return successResponse(c, {
    authHeader: authHeader ? 'Present' : 'Missing',
    user: user || null,
    tokenPayload: tokenPayload || null,
    headers: {
      authorization: c.req.header('Authorization') ? 'Set' : 'Missing',
    },
  });
});

export default app;
