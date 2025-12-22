# V1 to V2 Migration Guide

## Overview
This document outlines the migration from the monolithic v1 Next.js app to the v2 architecture with a separate backend server.

## What's Been Completed

### 1. Project Structure
✅ Created `/src/types/` - TypeScript types for all data models
✅ Created `/src/lib/` - Utility functions and helpers
✅ Created `/src/store/` - Zustand stores for state management
✅ Created `/src/actions/` - Server actions for API communication
✅ Created `/src/components/ui/` - Reusable UI components

### 2. Core Components
✅ **Button** - Reusable button with variants (primary, secondary, outline, ghost, danger)
✅ **Input** - Form input with icon support and error states
✅ **Card** - Container component with hover effects
✅ **Badge** - Status/tag display component

### 3. State Management (Zustand)
✅ **useAuthStore** - User authentication, tokens, phone, OTP state
✅ **useLocationStore** - Current location, saved addresses
✅ **useCartStore** - Cart items, selected vendor
✅ **useOrdersStore** - Orders management
✅ **useUIStore** - Navigation visibility, notifications count

### 4. Server Actions (API Communication)
✅ **auth.ts**
- `sendOTP(phone)` - Send OTP to phone
- `verifyOTP(phone, otp)` - Verify OTP and get JWT token
- `getCurrentUser(token)` - Fetch current user
- `logout(token)` - Logout user
- `adminLogin(email, password)` - Admin authentication

✅ **products.ts**
- `getProducts(params)` - Fetch products with filters
- `getProductById(productId)` - Get single product
- `searchProducts(query)` - Search products
- `getVendorById(vendorId)` - Get vendor details
- `getVendors(params)` - List vendors

✅ **orders.ts**
- `createOrder(token, data)` - Create new order
- `getOrders(token, params)` - Fetch user orders
- `getOrderById(token, orderId)` - Get order details
- `updateOrderStatus(token, orderId, status)` - Update order
- `getCart(token)` - Fetch cart
- `addToCart(token, data)` - Add item to cart
- `removeFromCart(token, itemId)` - Remove from cart
- `clearCart(token)` - Clear entire cart

### 5. Pages Created
✅ `/auth` - OTP login page
✅ `/auth/verify` - OTP verification page
✅ `/` - Home page with products and restaurants

## How It Works

### Authentication Flow
```
1. User enters phone number on /auth page
2. sendOTP() server action calls v2 server endpoint: POST /auth/send-otp
3. User receives OTP and navigates to /auth/verify
4. User enters 6-digit OTP
5. verifyOTP() server action calls v2 server: POST /auth/verify-otp
6. Server returns JWT token and user data
7. Token and user stored in useAuthStore
8. User redirected to home page
```

### Data Fetching with Server Actions
```
'use client';

import { getProducts } from '@/actions/products';

export default function MyComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts({ limit: 10 });
      if (result.success) {
        setProducts(result.data.products);
      }
    };
    fetchData();
  }, []);

  return (
    // JSX here
  );
}
```

### Using Authentication in Pages
```
'use client';

import { useAuthStore } from '@/store';

export default function MyPage() {
  const { user, token, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  // Use token for authenticated API calls
  const result = await getOrders(token);
}
```

## Next Steps - Pages to Create

### Priority 1: User Core Pages
These are essential for the user flow:

1. **`/cart`** - Shopping cart display
   - Use `useCartStore()` to display items
   - Fetch products to show prices
   - `clearCart()` button
   - Checkout button

2. **`/checkout`** - Order placement
   - Select delivery address
   - Select payment method (RAZORPAY, WALLET, CASH_ON_DELIVERY)
   - Review order summary
   - Call `createOrder(token, {...})`

3. **`/orders`** - Order history
   - Fetch orders with `getOrders(token, { status: 'COMPLETED' })`
   - Display order list with status
   - Link to order details

4. **`/orders/[id]`** - Order details
   - Fetch order with `getOrderById(token, orderId)`
   - Display items, pricing, status
   - Show order tracking info

5. **`/profile`** - User profile
   - Display user info from `useAuthStore`
   - Edit profile button
   - Links to addresses, payments, settings

6. **`/profile/addresses`** - Saved addresses
   - Fetch from `useLocationStore`
   - Add new address
   - Edit/delete addresses
   - Set default address

### Priority 2: Store & Products
1. **`/search`** - Search vendors and products
   - Search input
   - Filter by type, rating, distance
   - Use `searchProducts()` and `getVendors()`

2. **`/store/[id]`** - Store detail page
   - Fetch vendor with `getVendorById(vendorId)`
   - Fetch vendor products with `getProducts({ vendor: id })`
   - Display menu organized by category
   - Add to cart functionality

3. **`/category/[id]`** - Category page
   - Fetch products by category
   - Display filtered products
   - Add to cart

### Priority 3: Special Features
1. **`/party`** - Party mode
   - Create party event
   - Invite friends
   - Shared cart management

2. **`/genie`** - On-demand delivery
   - Create multi-stop delivery
   - Map integration for stops
   - Real-time tracking

3. **`/offers`** - Promotions
   - Display active offers
   - Coupon codes
   - Apply discounts

### Priority 4: Vendor Portal
Create separate routes under `/vendor`:
1. `/vendor/login` - Vendor authentication
2. `/vendor/dashboard` - Sales overview
3. `/vendor/orders` - Incoming orders
4. `/vendor/menu` - Menu management
5. `/vendor/earnings` - Revenue tracking

### Priority 5: Rider Portal
Create routes under `/rider`:
1. `/rider/login` - Rider authentication
2. `/rider/orders` - Available orders
3. `/rider/earnings` - Earnings summary
4. `/rider/profile` - Rider profile

### Priority 6: Admin Dashboard
Create routes under `/admin`:
1. `/admin/login` - Admin authentication
2. `/admin` - Dashboard overview
3. `/admin/orders` - All platform orders
4. `/admin/users` - User management
5. `/admin/vendors` - Vendor management
6. `/admin/riders` - Rider management

## Environment Setup

1. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

2. Start the v2 server:
```bash
cd /Users/roydevelops/Desktop/Dev/Companies/Infiniti/drop/v2/server
bun install
bun dev
```

3. Start the v2 client:
```bash
cd /Users/roydevelops/Desktop/Dev/Companies/Infiniti/drop/v2/client/web
bun install
bun dev
```

## Common Patterns

### Creating a Page with Server Actions

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { getOrders } from '@/actions/orders';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      const result = await getOrders(token!, { limit: 20 });
      if (result.success && result.data) {
        setOrders(result.data.orders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### Creating Protected Routes

Use middleware or check `isAuthenticated` in pages:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected content</div>;
}
```

### Form Submission with Server Actions

```typescript
'use client';

import { useState } from 'react';
import { createOrder } from '@/actions/orders';
import Button from '@/components/ui/Button';

export default function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createOrder(token!, {
      vendorId: 'vendor-123',
      addressId: 'address-456',
      items: [...],
      paymentMethod: 'RAZORPAY',
    });

    if (result.success) {
      // Handle success
    } else {
      // Handle error
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" loading={isLoading}>
        Place Order
      </Button>
    </form>
  );
}
```

## API Response Format

All API calls return:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
```

## Notes

- All pages are `'use client'` components since they use React hooks
- Server actions handle API communication and return typed responses
- Zustand stores persist data to localStorage
- No middleware authentication yet - check `isAuthenticated` in components
- Token is stored in Zustand store, passed to server actions as needed

## Troubleshooting

**Issue**: Server actions not working
- Ensure `.env.local` has `NEXT_PUBLIC_API_URL`
- Check v2 server is running on port 3001

**Issue**: Authentication not persisting
- Zustand store is persisted to localStorage automatically
- Clear localStorage if having issues: `localStorage.clear()`

**Issue**: CORS errors
- Ensure v2 server CORS is configured for `http://localhost:3000`

## Key Files Reference

- Types: `/src/types/index.ts`
- Stores: `/src/store/index.ts`
- Utilities: `/src/lib/utils.ts`
- Server Actions: `/src/actions/*.ts`
- UI Components: `/src/components/ui/*.tsx`
