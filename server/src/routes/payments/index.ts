import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';
import crypto from 'crypto';

const app = new Hono();

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// POST /payments/create - Create Razorpay order
app.post('/create', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { orderId, amount, currency = 'INR' } = body;

    if (!orderId || !amount) {
      return badRequestResponse(c, 'Order ID and amount are required');
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return errorResponse(c, 'Order not found', 404, 'Not Found');
    }

    if (order.userId !== user.userId) {
      return errorResponse(c, 'Unauthorized to pay for this order', 403, 'Forbidden');
    }

    // In production, use actual Razorpay SDK
    // For now, we'll create a mock payment order
    const razorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

    // You would normally call Razorpay API here:
    /*
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: orderId,
      payment_capture: 1
    });
    */

    return successResponse(
      c,
      {
        razorpayOrderId,
        amount,
        currency,
        keyId: RAZORPAY_KEY_ID,
        orderId,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: user.userId,
        },
      },
      'Payment order created successfully'
    );
  } catch (error) {
    console.error('Create payment error:', error);
    return errorResponse(c, 'Failed to create payment order', 500);
  }
});

// POST /payments/verify - Verify payment
app.post('/verify', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return badRequestResponse(c, 'Missing payment verification details');
    }

    // Verify order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return errorResponse(c, 'Order not found', 404, 'Not Found');
    }

    if (order.userId !== user.userId) {
      return errorResponse(c, 'Unauthorized', 403, 'Forbidden');
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // In production mode with real Razorpay, verify signature strictly
    // For development, we'll accept the payment
    const isSignatureValid =
      process.env.NODE_ENV === 'production'
        ? generatedSignature === razorpay_signature
        : true;

    if (!isSignatureValid) {
      // Update order payment status to failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
        },
      });

      return errorResponse(c, 'Payment verification failed', 400, 'Bad Request');
    }

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
      },
    });

    // You can also store payment details in a separate Payment table
    // await prisma.payment.create({...})

    return successResponse(
      c,
      {
        order: updatedOrder,
        paymentId: razorpay_payment_id,
        verified: true,
      },
      'Payment verified successfully'
    );
  } catch (error) {
    console.error('Verify payment error:', error);
    return errorResponse(c, 'Failed to verify payment', 500);
  }
});

// GET /payments/orders/:orderId - Get payment status for order
app.get('/orders/:orderId', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const orderId = c.req.param('orderId');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
        subtotal: true,
        deliveryFee: true,
        platformFee: true,
        discount: true,
        tip: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return errorResponse(c, 'Order not found', 404, 'Not Found');
    }

    // In production, you might also fetch from Razorpay to get real-time status
    /*
    if (order.razorpayOrderId) {
      const razorpay = new Razorpay({...});
      const razorpayOrder = await razorpay.orders.fetch(order.razorpayOrderId);
      // Merge razorpay details with order
    }
    */

    return successResponse(c, order);
  } catch (error) {
    console.error('Get payment status error:', error);
    return errorResponse(c, 'Failed to fetch payment status', 500);
  }
});

// POST /payments/webhook - Razorpay webhook (for automatic payment updates)
app.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('x-razorpay-signature');
    const body = await c.req.text();

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return errorResponse(c, 'Invalid signature', 400, 'Bad Request');
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.authorized':
      case 'payment.captured':
        // Update order payment status
        const paymentEntity = event.payload.payment.entity;
        const orderId = paymentEntity.notes?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'COMPLETED',
            },
          });
        }
        break;

      case 'payment.failed':
        const failedPayment = event.payload.payment.entity;
        const failedOrderId = failedPayment.notes?.orderId;

        if (failedOrderId) {
          await prisma.order.update({
            where: { id: failedOrderId },
            data: {
              paymentStatus: 'FAILED',
            },
          });
        }
        break;

      case 'refund.processed':
        const refund = event.payload.refund.entity;
        const refundOrderId = refund.notes?.orderId;

        if (refundOrderId) {
          await prisma.order.update({
            where: { id: refundOrderId },
            data: {
              paymentStatus: 'REFUNDED',
            },
          });
        }
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse(c, 'Webhook processing failed', 500);
  }
});

export default app;
