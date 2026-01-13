import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  paginatedResponse,
  getPaginationParams,
} from '../../middleware/response';
import prisma from '../../lib/prisma';
import { createNotification } from '../../lib/notifications';

const app = new Hono();

// GET /wallet - Get wallet balance and transactions
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const { page, limit, skip } = getPaginationParams(c);

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.userId,
          balance: 0,
        },
      });
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return c.json({
      success: true,
      data: {
        wallet: {
          id: wallet.id,
          balance: wallet.balance,
        },
        transactions,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    return errorResponse(c, 'Failed to fetch wallet details', 500);
  }
});

// POST /wallet/add-money - Add money to wallet
app.post('/add-money', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { amount, paymentMethod, transactionId } = body;

    if (!amount || amount <= 0) {
      return badRequestResponse(c, 'Invalid amount');
    }

    if (!paymentMethod) {
      return badRequestResponse(c, 'Payment method is required');
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.userId,
          balance: 0,
        },
      });
    }

    // Add money to wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'TOP_UP',
        description: `Added money via ${paymentMethod}${transactionId ? ` (Txn: ${transactionId})` : ''}`,
      },
    });

    // Send notification
    await createNotification(
      user.userId,
      'Money Added to Wallet',
      `₹${amount} has been added to your wallet successfully.`,
      'SYSTEM',
      { walletBalance: updatedWallet.balance }
    );

    return successResponse(
      c,
      {
        wallet: updatedWallet,
        transaction,
      },
      'Money added successfully'
    );
  } catch (error) {
    console.error('Add money error:', error);
    return errorResponse(c, 'Failed to add money to wallet', 500);
  }
});

// POST /wallet/refund - Create refund to wallet
app.post('/refund', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { orderId, amount, reason } = body;

    if (!orderId || !amount || amount <= 0) {
      return badRequestResponse(c, 'Order ID and valid amount are required');
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return errorResponse(c, 'Order not found', 404, 'Not Found');
    }

    if (order.userId !== user.userId) {
      return errorResponse(c, 'Unauthorized', 403, 'Forbidden');
    }

    // Check if refund amount is valid
    if (amount > order.total) {
      return badRequestResponse(c, 'Refund amount cannot exceed order total');
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.userId,
          balance: 0,
        },
      });
    }

    // Add refund to wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'REFUND',
        description: `Refund for order #${order.orderNumber}${reason ? `: ${reason}` : ''}`,
        orderId: order.id,
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'REFUNDED',
        status: 'REFUNDED',
      },
    });

    // Send notification
    await createNotification(
      user.userId,
      'Refund Processed',
      `₹${amount} has been refunded to your wallet for order #${order.orderNumber}.`,
      'ORDER_UPDATE',
      { orderId: order.id, walletBalance: updatedWallet.balance }
    );

    return successResponse(
      c,
      {
        wallet: updatedWallet,
        transaction,
      },
      'Refund processed successfully'
    );
  } catch (error) {
    console.error('Refund error:', error);
    return errorResponse(c, 'Failed to process refund', 500);
  }
});

// POST /wallet/deduct - Deduct money from wallet (for orders)
app.post('/deduct', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { amount, orderId, description } = body;

    if (!amount || amount <= 0) {
      return badRequestResponse(c, 'Invalid amount');
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
    });

    if (!wallet) {
      return errorResponse(c, 'Wallet not found', 404, 'Not Found');
    }

    // Check if sufficient balance
    if (wallet.balance < amount) {
      return badRequestResponse(c, 'Insufficient wallet balance');
    }

    // Deduct money from wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -amount,
        type: 'DEBIT',
        description: description || `Payment for order${orderId ? ` #${orderId}` : ''}`,
        orderId,
      },
    });

    return successResponse(
      c,
      {
        wallet: updatedWallet,
        transaction,
      },
      'Payment deducted from wallet successfully'
    );
  } catch (error) {
    console.error('Deduct wallet error:', error);
    return errorResponse(c, 'Failed to deduct from wallet', 500);
  }
});

// POST /wallet/cashback - Add cashback to wallet
app.post('/cashback', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Not authenticated');
    }

    const body = await c.req.json();
    const { amount, orderId, description } = body;

    if (!amount || amount <= 0) {
      return badRequestResponse(c, 'Invalid amount');
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.userId,
          balance: 0,
        },
      });
    }

    // Add cashback to wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: 'CASHBACK',
        description: description || `Cashback${orderId ? ` for order #${orderId}` : ''}`,
        orderId,
      },
    });

    // Send notification
    await createNotification(
      user.userId,
      'Cashback Received!',
      `You received ₹${amount} cashback in your wallet.`,
      'PROMOTION',
      { walletBalance: updatedWallet.balance }
    );

    return successResponse(
      c,
      {
        wallet: updatedWallet,
        transaction,
      },
      'Cashback added successfully'
    );
  } catch (error) {
    console.error('Cashback error:', error);
    return errorResponse(c, 'Failed to add cashback', 500);
  }
});

export default app;
