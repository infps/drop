/**
 * Routes Index
 *
 * This file combines all route modules and exports a main router.
 * All routes are prefixed with /api/v1 in the main index.ts
 *
 * Available Routes:
 * - /api/v1/auth/* - Authentication routes (send-otp, verify-otp, admin-login, me, logout)
 * - /api/v1/orders - Order management routes
 *   - GET /api/v1/orders - List orders with pagination and filters
 *   - POST /api/v1/orders - Create new order
 *   - GET /api/v1/orders/:id - Get order details
 *   - PATCH /api/v1/orders/:id - Update order status
 *   - PUT /api/v1/orders/:id - Update order status (alias)
 * - /api/v1/user/* - User management routes
 *   - GET /api/v1/user/profile - Get user profile
 *   - PUT /api/v1/user/profile - Update user profile
 *   - GET /api/v1/user/addresses - List user addresses
 *   - POST /api/v1/user/addresses - Add new address
 *   - PUT /api/v1/user/addresses/:id - Update address
 *   - DELETE /api/v1/user/addresses/:id - Delete address
 * - /api/v1/rider/* - Rider routes
 *   - GET /api/v1/rider/orders - Get rider's assigned orders
 *   - POST /api/v1/rider/orders/accept - Accept/update order
 *   - POST /api/v1/rider/location - Update rider's real-time location
 *   - GET /api/v1/rider/location - Get rider status
 *   - GET /api/v1/rider/earnings - Get rider earnings summary
 *   - GET /api/v1/rider/profile - Get rider profile
 *   - PUT /api/v1/rider/profile - Update rider profile
 * - /api/v1/vendor/* - Vendor routes
 *   - GET /api/v1/vendor/menu - Get vendor's menu items
 *   - POST /api/v1/vendor/menu - Add menu item
 *   - PUT /api/v1/vendor/menu/:id - Update menu item
 *   - DELETE /api/v1/vendor/menu/:id - Delete menu item
 *   - GET /api/v1/vendor/orders - Get vendor's orders
 *   - PATCH /api/v1/vendor/orders/:id - Update order status
 *   - GET /api/v1/vendor/earnings - Get vendor earnings summary
 *   - GET /api/v1/vendor/profile - Get vendor profile
 *   - PUT /api/v1/vendor/profile - Update vendor profile
 * - /api/v1/products - Products routes
 *   - GET /api/v1/products - Get products by category with pagination
 *   - GET /api/v1/products/:id - Get product details
 * - /api/v1/cart - Cart routes
 *   - GET /api/v1/cart - Get user's cart
 *   - POST /api/v1/cart - Add item to cart
 *   - PUT /api/v1/cart/:itemId - Update cart item quantity
 *   - DELETE /api/v1/cart/:itemId - Remove item from cart
 *   - DELETE /api/v1/cart - Clear entire cart
 * - /api/v1/search - Search route
 *   - GET /api/v1/search - Search vendors and products by query string
 * - /api/v1/notifications - Notifications routes
 *   - GET /api/v1/notifications - Get user notifications with pagination
 *   - POST /api/v1/notifications/:id/read - Mark notification as read
 *   - POST /api/v1/notifications/read-all - Mark all notifications as read
 *   - DELETE /api/v1/notifications/:id - Delete a notification
 *   - DELETE /api/v1/notifications - Clear all notifications
 *   - GET /api/v1/notifications/unread-count - Get unread notification count
 * - /api/v1/admin/* - Admin routes (require admin authentication)
 *   - GET /api/v1/admin/dashboard - Admin dashboard stats
 *   - GET /api/v1/admin/users - List all users with pagination
 *   - GET /api/v1/admin/riders - List all riders with pagination and status
 *   - GET /api/v1/admin/vendors - List all vendors with pagination
 *   - GET /api/v1/admin/orders - List all orders with filters
 *   - GET /api/v1/admin/payments - View payment/transaction history
 *   - POST /api/v1/admin/zones - Create delivery zones
 *   - GET /api/v1/admin/zones - List zones
 *   - PUT /api/v1/admin/zones/:id - Update zone
 *   - DELETE /api/v1/admin/zones/:id - Delete zone
 * - /api/v1/payments - Payment routes
 *   - POST /api/v1/payments/create - Create Razorpay order
 *   - POST /api/v1/payments/verify - Verify payment
 *   - GET /api/v1/payments/orders/:orderId - Get payment status for order
 *   - POST /api/v1/payments/webhook - Razorpay webhook handler
 * - /api/v1/wallet - Wallet routes
 *   - GET /api/v1/wallet - Get wallet balance and transactions
 *   - POST /api/v1/wallet/add-money - Add money to wallet
 *   - POST /api/v1/wallet/refund - Create refund to wallet
 *   - POST /api/v1/wallet/deduct - Deduct money from wallet
 *   - POST /api/v1/wallet/cashback - Add cashback to wallet
 * - /api/v1/upload - File upload routes
 *   - POST /api/v1/upload - Upload single file
 *   - POST /api/v1/upload/multiple - Upload multiple files
 *   - DELETE /api/v1/upload/:category/:filename - Delete uploaded file
 *   - GET /api/v1/upload/presigned-url - Generate presigned URL for cloud storage
 *
 * Authentication:
 * All routes (except auth routes and payment webhooks) require authentication via:
 * - Authorization: Bearer <token> header, OR
 * - Cookie: auth-token, rider-token, admin-token, or token
 */

import { Hono } from 'hono';
import authRoutes from './auth';
import ordersRoutes from './orders/orders';
import userRoutes from './user';
import riderRoutes from './rider';
import vendorRoutes from './vendor';
import productsRoutes from './products';
import cartRoutes from './cart';
import searchRoutes from './search';
import notificationsRoutes from './notifications';
import adminRoutes from './admin';
import paymentsRoutes from './payments';
import walletRoutes from './wallet';
import uploadRoutes from './upload';

const app = new Hono();

// Mount all route modules
app.route('/auth', authRoutes);
app.route('/orders', ordersRoutes);
app.route('/user', userRoutes);
app.route('/rider', riderRoutes);
app.route('/vendor', vendorRoutes);
app.route('/products', productsRoutes);
app.route('/cart', cartRoutes);
app.route('/search', searchRoutes);
app.route('/notifications', notificationsRoutes);
app.route('/admin', adminRoutes);
app.route('/payments', paymentsRoutes);
app.route('/wallet', walletRoutes);
app.route('/upload', uploadRoutes);

// Health check for routes
app.get('/health', (c) => {
  return c.json({
    status: 'success',
    message: 'Routes are healthy',
    version: 'v1',
    routes: {
      auth: '/auth',
      orders: '/orders',
      user: '/user',
      rider: '/rider',
      vendor: '/vendor',
      products: '/products',
      cart: '/cart',
      search: '/search',
      notifications: '/notifications',
      admin: '/admin',
      payments: '/payments',
      wallet: '/wallet',
      upload: '/upload',
    },
  });
});

export default app;
