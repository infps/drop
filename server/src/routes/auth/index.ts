import { Hono } from 'hono';
import sendOtpRoute from './send-otp';
import verifyOtpRoute from './verify-otp';
import adminLoginRoute from './admin-login';
import meRoute from './me';
import logoutRoute from './logout';

const app = new Hono();

// Auth routes
app.route('/send-otp', sendOtpRoute);
app.route('/verify-otp', verifyOtpRoute);
app.route('/admin-login', adminLoginRoute);
app.route('/me', meRoute);
app.route('/logout', logoutRoute);

export default app;
