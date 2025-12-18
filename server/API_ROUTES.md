# Drop V2 API Routes Reference

**Base URL:** `http://localhost:3001/api/v1`

**Authentication:** Most routes require authentication via JWT token in `Authorization: Bearer <token>` header or cookies.

---

## Authentication Routes

### POST /auth/send-otp
Send OTP to phone number for authentication.

**Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### POST /auth/verify-otp
Verify OTP and get JWT token.

**Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clxxx",
      "phone": "+919876543210",
      "name": "John Doe"
    }
  }
}
```

---

### POST /auth/admin-login
Admin login with email and password.

**Body:**
```json
{
  "email": "admin@drop.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "clxxx",
      "email": "admin@drop.com",
      "name": "Admin User",
      "role": "ADMIN"
    }
  }
}
```

---

### GET /auth/me
Get current authenticated user details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "clxxx",
    "phone": "+919876543210",
    "type": "user",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### POST /auth/logout
Logout current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Order Routes

### GET /orders
List user's orders with pagination and filters.

**Query Params:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by order status
- `type` (optional): `active` or `past`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### POST /orders
Create a new order.

**Body:**
```json
{
  "vendorId": "clxxx",
  "addressId": "clxxx",
  "items": [
    {
      "productId": "clxxx",
      "quantity": 2,
      "customizations": {},
      "notes": "Extra spicy"
    }
  ],
  "paymentMethod": "RAZORPAY",
  "tip": 20,
  "deliveryInstructions": "Ring the bell twice",
  "couponCode": "FIRST50"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {...},
    "pointsEarned": 10,
    "message": "Order placed successfully"
  }
}
```

---

### GET /orders/:id
Get order details by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "orderNumber": "DRPXXX",
    "status": "CONFIRMED",
    "vendor": {...},
    "items": [...],
    "total": 500
  }
}
```

---

### PATCH /orders/:id
Update order status (for riders/vendors).

**Body:**
```json
{
  "status": "PREPARING",
  "note": "Started preparing"
}
```

---

## User Routes

### GET /user/profile
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "phone": "+919876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "isKycVerified": true,
    "wallet": {...},
    "loyaltyPoints": {...}
  }
}
```

---

### PUT /user/profile
Update user profile.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-01",
  "avatar": "https://..."
}
```

---

### GET /user/addresses
List user addresses.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx",
      "label": "Home",
      "fullAddress": "123 Main St, City",
      "latitude": 12.345,
      "longitude": 67.890,
      "isDefault": true
    }
  ]
}
```

---

### POST /user/addresses
Add new address.

**Body:**
```json
{
  "label": "Work",
  "fullAddress": "456 Office St, City",
  "landmark": "Near Mall",
  "latitude": 12.345,
  "longitude": 67.890,
  "isDefault": false
}
```

---

### PUT /user/addresses/:id
Update address.

---

### DELETE /user/addresses/:id
Delete address.

---

## Rider Routes

### GET /rider/orders
Get rider's assigned orders.

**Query Params:**
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

### POST /rider/orders/accept
Accept or update order.

**Body:**
```json
{
  "orderId": "clxxx",
  "action": "accept"
}
```

---

### POST /rider/location
Update rider's real-time location.

**Body:**
```json
{
  "latitude": 12.345,
  "longitude": 67.890,
  "isOnline": true,
  "isAvailable": true
}
```

---

### GET /rider/location
Get rider status and location.

---

### GET /rider/earnings
Get rider earnings summary.

**Query Params:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 5000,
    "todayEarnings": 500,
    "totalDeliveries": 100,
    "todayDeliveries": 5,
    "breakdown": {...}
  }
}
```

---

### GET /rider/profile
Get rider profile.

---

### PUT /rider/profile
Update rider profile.

---

## Vendor Routes

### GET /vendor/menu
Get vendor's menu items.

---

### POST /vendor/menu
Add menu item.

**Body:**
```json
{
  "categoryId": "clxxx",
  "name": "Margherita Pizza",
  "description": "Classic pizza",
  "price": 299,
  "images": ["https://..."],
  "isVeg": true,
  "inStock": true
}
```

---

### PUT /vendor/menu/:id
Update menu item.

---

### DELETE /vendor/menu/:id
Delete menu item.

---

### GET /vendor/orders
Get vendor's orders.

**Query Params:**
- `status` (optional): Filter by status
- `date` (optional): Filter by date

---

### PATCH /vendor/orders/:id
Update order status.

**Body:**
```json
{
  "status": "PREPARING",
  "estimatedTime": 20
}
```

---

### GET /vendor/earnings
Get vendor earnings summary.

---

### GET /vendor/profile
Get vendor profile.

---

### PUT /vendor/profile
Update vendor profile.

---

## Product Routes

### GET /products
Get products with filters.

**Query Params:**
- `category` (optional): Category ID
- `vendorId` (optional): Vendor ID
- `search` (optional): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### GET /products/:id
Get product details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "Margherita Pizza",
    "price": 299,
    "vendor": {...},
    "images": [...],
    "rating": 4.5
  }
}
```

---

## Cart Routes

### GET /cart
Get user's cart.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "subtotal": 500,
    "itemCount": 3
  }
}
```

---

### POST /cart
Add item to cart.

**Body:**
```json
{
  "productId": "clxxx",
  "quantity": 1,
  "customizations": {},
  "notes": "Extra cheese"
}
```

---

### PUT /cart/:itemId
Update cart item quantity.

**Body:**
```json
{
  "quantity": 2
}
```

---

### DELETE /cart/:itemId
Remove item from cart.

---

### DELETE /cart
Clear entire cart.

---

## Search Routes

### GET /search
Search vendors and products.

**Query Params:**
- `q`: Search query (required)
- `type` (optional): `vendors`, `products`, or `all`
- `latitude` (optional): User latitude
- `longitude` (optional): User longitude

**Response:**
```json
{
  "success": true,
  "data": {
    "vendors": [...],
    "products": [...]
  }
}
```

---

## Notification Routes

### GET /notifications
Get user notifications.

**Query Params:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### POST /notifications/:id/read
Mark notification as read.

---

### POST /notifications/read-all
Mark all notifications as read.

---

### DELETE /notifications/:id
Delete a notification.

---

### DELETE /notifications
Clear all notifications.

---

### GET /notifications/unread-count
Get unread notification count.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## Admin Routes

**Note:** All admin routes require admin authentication (`type: 'admin'` in JWT).

### GET /admin/dashboard
Get admin dashboard stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1000,
      "totalRiders": 50,
      "totalVendors": 100,
      "totalOrders": 5000,
      "todayOrders": 50,
      "activeOrders": 10,
      "totalRevenue": 500000,
      "todayRevenue": 5000,
      "platformFees": 10000
    },
    "ordersByStatus": [...],
    "topVendors": [...]
  }
}
```

---

### GET /admin/users
List all users.

**Query Params:**
- `page`, `limit`: Pagination
- `search`: Search by name/phone/email

---

### GET /admin/riders
List all riders.

**Query Params:**
- `page`, `limit`: Pagination
- `status`: `online`, `offline`, `available`, `busy`
- `search`: Search query

---

### GET /admin/vendors
List all vendors.

**Query Params:**
- `page`, `limit`: Pagination
- `type`: Vendor type
- `status`: `active`, `inactive`
- `search`: Search query

---

### GET /admin/orders
List all orders.

**Query Params:**
- `page`, `limit`: Pagination
- `status`: Order status
- `paymentStatus`: Payment status
- `vendorId`: Filter by vendor
- `riderId`: Filter by rider

---

### GET /admin/payments
View payment/transaction history.

**Query Params:**
- `page`, `limit`: Pagination
- `type`: Transaction type

---

### POST /admin/zones
Create delivery zone.

**Body:**
```json
{
  "name": "Zone A",
  "polygon": {...},
  "isActive": true,
  "surgePricing": 1.2,
  "deliveryFee": 40
}
```

---

### GET /admin/zones
List all delivery zones.

---

### PUT /admin/zones/:id
Update delivery zone.

---

### DELETE /admin/zones/:id
Delete delivery zone.

---

## Payment Routes

### POST /payments/create
Create Razorpay payment order.

**Body:**
```json
{
  "orderId": "clxxx",
  "amount": 500,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xxx",
    "amount": 500,
    "currency": "INR",
    "keyId": "rzp_test_xxx",
    "orderId": "clxxx"
  }
}
```

---

### POST /payments/verify
Verify Razorpay payment.

**Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "orderId": "clxxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {...},
    "paymentId": "pay_xxx",
    "verified": true
  }
}
```

---

### GET /payments/orders/:orderId
Get payment status for order.

---

### POST /payments/webhook
Razorpay webhook handler (no authentication required).

---

## Wallet Routes

### GET /wallet
Get wallet balance and transactions.

**Query Params:**
- `page`, `limit`: Pagination for transactions

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": "clxxx",
      "balance": 1000
    },
    "transactions": [...]
  },
  "pagination": {...}
}
```

---

### POST /wallet/add-money
Add money to wallet.

**Body:**
```json
{
  "amount": 500,
  "paymentMethod": "RAZORPAY",
  "transactionId": "pay_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "balance": 1500
    },
    "transaction": {...}
  },
  "message": "Money added successfully"
}
```

---

### POST /wallet/refund
Create refund to wallet.

**Body:**
```json
{
  "orderId": "clxxx",
  "amount": 500,
  "reason": "Order cancelled"
}
```

---

### POST /wallet/deduct
Deduct money from wallet (for orders).

**Body:**
```json
{
  "amount": 500,
  "orderId": "clxxx",
  "description": "Payment for order"
}
```

---

### POST /wallet/cashback
Add cashback to wallet.

**Body:**
```json
{
  "amount": 50,
  "orderId": "clxxx",
  "description": "Cashback on order"
}
```

---

## Upload Routes

### POST /upload
Upload single file.

**Body:** `multipart/form-data`
- `file`: File to upload
- `type` (optional): `avatar`, `product`, `vendor`, `document`, `temp`
- `allowedTypes` (optional): `image` or `all`

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "1234567890-abc123.jpg",
    "originalName": "photo.jpg",
    "size": 102400,
    "type": "image/jpeg",
    "category": "avatars",
    "url": "http://localhost:3001/uploads/avatars/1234567890-abc123.jpg",
    "uploadedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### POST /upload/multiple
Upload multiple files.

**Body:** `multipart/form-data`
- `files`: Array of files
- `type` (optional): File category
- `allowedTypes` (optional): `image` or `all`

**Response:**
```json
{
  "success": true,
  "data": {
    "uploaded": [...],
    "errors": [...],
    "totalUploaded": 3,
    "totalErrors": 0
  }
}
```

---

### DELETE /upload/:category/:filename
Delete uploaded file.

---

### GET /upload/presigned-url
Generate presigned URL for cloud storage.

**Query Params:**
- `filename`: Original filename
- `type` (optional): File category

**Response:**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://...",
    "filename": "unique-filename.jpg",
    "category": "products",
    "expiresIn": 3600,
    "method": "PUT"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid phone number format",
  "statusCode": 400
}
```

**Common Status Codes:**
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Rate Limiting

**Note:** Implement rate limiting in production:
- Authentication routes: 5 requests per minute
- General routes: 100 requests per minute
- Upload routes: 10 requests per minute

---

## Pagination

All list endpoints support pagination:

**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Health Check

### GET /api/v1/health

Check if API is healthy.

**Response:**
```json
{
  "status": "success",
  "message": "Routes are healthy",
  "version": "v1",
  "routes": {
    "auth": "/auth",
    "orders": "/orders",
    ...
  }
}
```

---

For complete integration examples, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md).
