import { Hono } from 'hono';
import { getCurrentUser } from '../../lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

// GET /cart - Get user's cart
app.get('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: {
            vendor: {
              select: { id: true, name: true, logo: true, minimumOrder: true, avgDeliveryTime: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by vendor
    type CartItemWithTotal = typeof cartItems[0] & { itemTotal: number };
    const groupedByVendor = cartItems.reduce((acc, item) => {
      const vendorId = item.product.vendorId;
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendor: item.product.vendor,
          items: [] as CartItemWithTotal[],
          subtotal: 0,
        };
      }
      const price = item.product.discountPrice || item.product.price;
      acc[vendorId].items.push({
        ...item,
        itemTotal: price * item.quantity,
      });
      acc[vendorId].subtotal += price * item.quantity;
      return acc;
    }, {} as Record<string, { vendor: typeof cartItems[0]['product']['vendor']; items: CartItemWithTotal[]; subtotal: number }>);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = Object.values(groupedByVendor).reduce((sum, group) => sum + group.subtotal, 0);

    return successResponse(c, {
      cartItems,
      groupedByVendor: Object.values(groupedByVendor),
      summary: {
        totalItems,
        subtotal: grandTotal,
        deliveryFee: grandTotal >= 199 ? 0 : 40,
        platformFee: Math.round(grandTotal * 0.02),
        total: grandTotal + (grandTotal >= 199 ? 0 : 40) + Math.round(grandTotal * 0.02),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return errorResponse(c, 'Failed to fetch cart', 500);
  }
});

// POST /cart - Add item to cart
app.post('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const body = await c.req.json();
    const { productId, quantity = 1, customizations, notes } = body;

    if (!productId) {
      return badRequestResponse(c, 'Product ID is required');
    }

    // Verify product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        vendor: {
          select: { id: true, name: true, isActive: true },
        },
      },
    });

    if (!product) {
      return notFoundResponse(c, 'Product not found');
    }

    if (!product.inStock) {
      return badRequestResponse(c, 'Product is out of stock');
    }

    if (!product.vendor.isActive) {
      return badRequestResponse(c, 'Vendor is currently unavailable');
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.userId,
        productId,
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          customizations: customizations || existingItem.customizations,
          notes: notes || existingItem.notes,
        },
        include: {
          product: {
            include: {
              vendor: {
                select: { id: true, name: true, logo: true },
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.userId,
          productId,
          quantity,
          customizations,
          notes,
        },
        include: {
          product: {
            include: {
              vendor: {
                select: { id: true, name: true, logo: true },
              },
            },
          },
        },
      });
    }

    return successResponse(c, { cartItem }, 'Item added to cart');
  } catch (error) {
    console.error('Add to cart error:', error);
    return errorResponse(c, 'Failed to add item to cart', 500);
  }
});

// PUT /cart/:itemId - Update cart item quantity
app.put('/:itemId', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const itemId = c.req.param('itemId');
    const body = await c.req.json();
    const { quantity, customizations, notes } = body;

    if (!itemId) {
      return badRequestResponse(c, 'Cart item ID is required');
    }

    // Verify cart item belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: user.userId,
      },
    });

    if (!existingItem) {
      return notFoundResponse(c, 'Cart item not found');
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return successResponse(c, null, 'Item removed from cart');
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        customizations: customizations !== undefined ? customizations : existingItem.customizations,
        notes: notes !== undefined ? notes : existingItem.notes,
      },
      include: {
        product: true,
      },
    });

    return successResponse(c, { cartItem }, 'Cart updated');
  } catch (error) {
    console.error('Update cart error:', error);
    return errorResponse(c, 'Failed to update cart', 500);
  }
});

// DELETE /cart/:itemId - Remove item from cart
app.delete('/:itemId', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    const itemId = c.req.param('itemId');

    if (!itemId) {
      return badRequestResponse(c, 'Cart item ID is required');
    }

    // Delete specific item
    const result = await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        userId: user.userId,
      },
    });

    if (result.count === 0) {
      return notFoundResponse(c, 'Cart item not found');
    }

    return successResponse(c, null, 'Item removed from cart');
  } catch (error) {
    console.error('Remove cart item error:', error);
    return errorResponse(c, 'Failed to remove item from cart', 500);
  }
});

// DELETE /cart - Clear entire cart
app.delete('/', async (c) => {
  try {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    // Clear entire cart
    await prisma.cartItem.deleteMany({
      where: { userId: user.userId },
    });

    return successResponse(c, null, 'Cart cleared');
  } catch (error) {
    console.error('Clear cart error:', error);
    return errorResponse(c, 'Failed to clear cart', 500);
  }
});

export default app;
