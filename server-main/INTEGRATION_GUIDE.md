# Drop V2 Server Integration Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Database Setup](#database-setup)
3. [Running the Server](#running-the-server)
4. [Environment Variables](#environment-variables)
5. [API Authentication](#api-authentication)
6. [Using Routes from React Native](#using-routes-from-react-native)
7. [Using Routes from Web Client](#using-routes-from-web-client)
8. [Performance Considerations](#performance-considerations)
9. [Error Handling](#error-handling)
10. [Payment Integration](#payment-integration)
11. [File Upload Integration](#file-upload-integration)
12. [WebSocket Real-time Updates](#websocket-real-time-updates)

---

## Getting Started

The Drop V2 server is built with:
- **Bun** - Fast JavaScript runtime
- **Hono** - Lightweight web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database

### Prerequisites

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Installation

```bash
cd v2/server

# Install dependencies
bun install

# Generate Prisma Client
bunx prisma generate
```

---

## Database Setup

### 1. PostgreSQL Setup

Install PostgreSQL on your system:

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE drop_v2;

# Create user (optional)
CREATE USER drop_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE drop_v2 TO drop_admin;
```

### 3. Configure Database URL

Update your `.env` file:

```env
DATABASE_URL="postgresql://drop_admin:your_password@localhost:5432/drop_v2"
```

### 4. Run Migrations

```bash
# Push schema to database
bunx prisma db push

# Or run migrations
bunx prisma migrate dev --name init

# Seed database (optional)
bun run seed
```

### 5. Prisma Studio (Database GUI)

```bash
bunx prisma studio
```

This opens a web interface at `http://localhost:5555` to view and edit your database.

---

## Running the Server

### Development Mode

```bash
# Start with auto-reload
bun run dev

# Server runs on http://localhost:3001
```

### Production Mode

```bash
# Build (if needed)
bun run build

# Start production server
bun run start
```

### Docker Setup (Optional)

```bash
# Build Docker image
docker build -t drop-v2-server .

# Run with Docker Compose
docker-compose up -d
```

---

## Environment Variables

Create a `.env` file in the `v2/server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/drop_v2"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# OTP Configuration
OTP_EXPIRY_MINUTES=5

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=10
BASE_URL=http://localhost:3001

# SMS Provider (for OTP)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Sentry (Optional - for error tracking)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## API Authentication

### Authentication Flow

1. **User Authentication (OTP-based)**
   - Send OTP: `POST /api/v1/auth/send-otp`
   - Verify OTP: `POST /api/v1/auth/verify-otp`
   - Returns JWT token

2. **Admin Authentication**
   - Login: `POST /api/v1/auth/admin-login`
   - Uses email/password

3. **Token Usage**

```javascript
// Option 1: Authorization Header
headers: {
  'Authorization': 'Bearer <jwt_token>'
}

// Option 2: Cookie (automatically set by server)
// Cookie: auth-token=<jwt_token>
```

### Get Current User

```javascript
// Get authenticated user info
GET /api/v1/auth/me

Response:
{
  "success": true,
  "data": {
    "userId": "...",
    "phone": "+91xxxxxxxxxx",
    "type": "user",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Using Routes from React Native

### Setup

```bash
npm install axios
# or
yarn add axios
```

### API Client Setup

```javascript
// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api/v1'; // Change for production

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login screen
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

### Example Usage

```javascript
// src/api/auth.js
import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authAPI = {
  // Send OTP
  sendOTP: async (phone) => {
    return apiClient.post('/auth/send-otp', { phone });
  },

  // Verify OTP
  verifyOTP: async (phone, otp) => {
    const response = await apiClient.post('/auth/verify-otp', { phone, otp });
    if (response.data?.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  // Logout
  logout: async () => {
    await apiClient.post('/auth/logout');
    await AsyncStorage.removeItem('auth_token');
  },
};

// src/api/orders.js
import apiClient from './client';

export const ordersAPI = {
  // Get orders
  getOrders: async (params) => {
    return apiClient.get('/orders', { params });
  },

  // Create order
  createOrder: async (orderData) => {
    return apiClient.post('/orders', orderData);
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
  },
};

// src/api/wallet.js
import apiClient from './client';

export const walletAPI = {
  // Get wallet
  getWallet: async () => {
    return apiClient.get('/wallet');
  },

  // Add money
  addMoney: async (amount, paymentMethod, transactionId) => {
    return apiClient.post('/wallet/add-money', {
      amount,
      paymentMethod,
      transactionId,
    });
  },
};
```

### Component Example

```jsx
// src/screens/OrdersScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ordersAPI } from '../api/orders';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders({
        page: 1,
        limit: 20,
        type: 'active',
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} />
        )}
        refreshing={loading}
        onRefresh={fetchOrders}
      />
    </View>
  );
};
```

---

## Using Routes from Web Client

### Setup (React + Axios)

```bash
npm install axios
```

### API Client Setup

```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
```

### React Query Integration (Recommended)

```bash
npm install @tanstack/react-query
```

```javascript
// src/api/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../orders';

export const useOrders = (filters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersAPI.getOrders(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersAPI.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
    },
  });
};

// Usage in component
const OrdersList = () => {
  const { data, isLoading, error } = useOrders({ type: 'active' });
  const createOrder = useCreateOrder();

  const handleCreateOrder = async (orderData) => {
    try {
      await createOrder.mutateAsync(orderData);
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data.data.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
```

---

## Performance Considerations

### 1. Pagination

Always use pagination for list endpoints:

```javascript
// Default: page=1, limit=10
GET /api/v1/orders?page=1&limit=20

// Response includes pagination metadata
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Filtering and Searching

Use query parameters to filter data on the server:

```javascript
// Filter orders by status
GET /api/v1/orders?status=PENDING&paymentStatus=COMPLETED

// Search vendors
GET /api/v1/admin/vendors?search=pizza&type=RESTAURANT

// Date range filtering
GET /api/v1/admin/orders?startDate=2024-01-01&endDate=2024-01-31
```

### 3. Caching Strategy

Implement caching on the client side:

```javascript
// React Query with staleTime
const { data } = useQuery({
  queryKey: ['vendors'],
  queryFn: fetchVendors,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// React Native - Simple in-memory cache
const cache = new Map();

const cachedFetch = async (key, fetchFn, ttl = 300000) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

### 4. Optimistic Updates

Update UI immediately, rollback on error:

```javascript
const updateOrder = useMutation({
  mutationFn: ordersAPI.updateStatus,
  onMutate: async (newOrder) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['orders', newOrder.id]);

    // Snapshot previous value
    const previousOrder = queryClient.getQueryData(['orders', newOrder.id]);

    // Optimistically update
    queryClient.setQueryData(['orders', newOrder.id], newOrder);

    return { previousOrder };
  },
  onError: (err, newOrder, context) => {
    // Rollback on error
    queryClient.setQueryData(['orders', newOrder.id], context.previousOrder);
  },
});
```

### 5. Request Batching

Batch multiple requests:

```javascript
const fetchDashboardData = async () => {
  const [orders, vendors, riders, stats] = await Promise.all([
    ordersAPI.getOrders(),
    vendorsAPI.getVendors(),
    ridersAPI.getRiders(),
    adminAPI.getDashboardStats(),
  ]);

  return { orders, vendors, riders, stats };
};
```

---

## Error Handling

### Server Response Format

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid phone number format",
  "statusCode": 400
}
```

### Client-side Error Handling

```javascript
// Centralized error handler
const handleAPIError = (error) => {
  if (error.statusCode === 400) {
    // Validation error
    toast.error(error.message);
  } else if (error.statusCode === 401) {
    // Unauthorized
    redirectToLogin();
  } else if (error.statusCode === 403) {
    // Forbidden
    toast.error('You do not have permission to perform this action');
  } else if (error.statusCode === 404) {
    // Not found
    toast.error('Resource not found');
  } else if (error.statusCode >= 500) {
    // Server error
    toast.error('Server error. Please try again later.');
  } else {
    // Unknown error
    toast.error(error.message || 'An unexpected error occurred');
  }
};

// Usage
try {
  await ordersAPI.createOrder(orderData);
} catch (error) {
  handleAPIError(error);
}
```

---

## Payment Integration

### Razorpay Integration Flow

#### 1. Create Payment Order

```javascript
// Client-side (React Native)
import { paymentsAPI } from '../api/payments';

const initiatePayment = async (orderId, amount) => {
  try {
    // Step 1: Create Razorpay order
    const paymentOrder = await paymentsAPI.createPaymentOrder({
      orderId,
      amount,
      currency: 'INR',
    });

    // paymentOrder contains:
    // - razorpayOrderId
    // - amount
    // - keyId
    // - orderId

    return paymentOrder;
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};
```

#### 2. Show Razorpay Checkout

```javascript
// React Native with react-native-razorpay
import RazorpayCheckout from 'react-native-razorpay';

const showRazorpayCheckout = async (paymentOrder, userDetails) => {
  const options = {
    description: `Order #${paymentOrder.orderId}`,
    image: 'https://yourdomain.com/logo.png',
    currency: paymentOrder.currency,
    key: paymentOrder.keyId,
    amount: paymentOrder.amount * 100, // Amount in paise
    name: 'Drop',
    order_id: paymentOrder.razorpayOrderId,
    prefill: {
      email: userDetails.email,
      contact: userDetails.phone,
      name: userDetails.name,
    },
    theme: { color: '#F97316' },
  };

  try {
    const data = await RazorpayCheckout.open(options);
    // Payment successful
    return data;
  } catch (error) {
    // Payment failed or cancelled
    throw error;
  }
};
```

#### 3. Verify Payment

```javascript
const verifyPayment = async (razorpayResponse, orderId) => {
  try {
    const result = await paymentsAPI.verifyPayment({
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
      orderId: orderId,
    });

    return result;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};
```

#### Complete Payment Flow

```javascript
const handlePayment = async (orderId, amount, userDetails) => {
  try {
    // Step 1: Create payment order
    const paymentOrder = await initiatePayment(orderId, amount);

    // Step 2: Show Razorpay checkout
    const razorpayResponse = await showRazorpayCheckout(paymentOrder, userDetails);

    // Step 3: Verify payment on server
    const verification = await verifyPayment(razorpayResponse, orderId);

    if (verification.data.verified) {
      // Payment successful
      navigation.navigate('OrderSuccess', { orderId });
    }
  } catch (error) {
    Alert.alert('Payment Failed', error.message);
  }
};
```

### Web Integration (React)

```javascript
// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Payment handler
const handleWebPayment = async (orderId, amount, userDetails) => {
  const res = await loadRazorpay();
  if (!res) {
    alert('Razorpay SDK failed to load');
    return;
  }

  const paymentOrder = await initiatePayment(orderId, amount);

  const options = {
    key: paymentOrder.keyId,
    amount: paymentOrder.amount * 100,
    currency: 'INR',
    name: 'Drop',
    description: `Order #${orderId}`,
    order_id: paymentOrder.razorpayOrderId,
    handler: async function (response) {
      try {
        const result = await verifyPayment(response, orderId);
        if (result.data.verified) {
          window.location.href = `/orders/${orderId}/success`;
        }
      } catch (error) {
        alert('Payment verification failed');
      }
    },
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },
    theme: {
      color: '#F97316',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
```

---

## File Upload Integration

### Upload Single File

```javascript
// React Native
import { uploadAPI } from '../api/upload';
import { launchImageLibrary } from 'react-native-image-picker';

const uploadAvatar = async () => {
  try {
    // Pick image
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;

    const asset = result.assets[0];

    // Create FormData
    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName,
    });
    formData.append('type', 'avatar');

    // Upload
    const response = await uploadAPI.uploadFile(formData);

    // response.data.url contains the uploaded file URL
    return response.data.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### Upload Multiple Files (Web)

```javascript
// React
const uploadProductImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  formData.append('type', 'product');
  formData.append('allowedTypes', 'image');

  try {
    const response = await uploadAPI.uploadMultiple(formData);
    return response.data.uploaded.map((f) => f.url);
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Component
const ProductImageUpload = () => {
  const [images, setImages] = useState([]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const urls = await uploadProductImages(files);
      setImages([...images, ...urls]);
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
    />
  );
};
```

---

## WebSocket Real-time Updates

### Server Setup (Future Enhancement)

```javascript
// Add to v2/server/src/index.ts
import { Server as SocketIOServer } from 'socket.io';

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(','),
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join room based on user role
  socket.on('join', ({ userId, role }) => {
    socket.join(`user:${userId}`);
    if (role === 'rider') {
      socket.join('riders');
    } else if (role === 'vendor') {
      socket.join('vendors');
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Emit events from routes
export const emitOrderUpdate = (orderId, update) => {
  io.to(`order:${orderId}`).emit('orderUpdate', update);
};
```

### Client Integration (React Native)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

// Connect
socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('join', { userId: currentUser.id, role: 'user' });
});

// Listen for order updates
socket.on('orderUpdate', (update) => {
  console.log('Order updated:', update);
  // Update UI
  setOrder(update);
});

// Cleanup
useEffect(() => {
  return () => {
    socket.disconnect();
  };
}, []);
```

---

## Testing the API

### Using cURL

```bash
# Send OTP
curl -X POST http://localhost:3001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:3001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Get orders (with auth)
curl -X GET http://localhost:3001/api/v1/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection (create one from routes documentation)
2. Set environment variables:
   - `base_url`: http://localhost:3001
   - `token`: {{auth_token}}
3. Use collection runner for automated testing

---

## Production Deployment

### 1. Environment Setup

```bash
# Set production environment variables
export NODE_ENV=production
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
export RAZORPAY_KEY_ID="rzp_live_..."
```

### 2. Build and Deploy

```bash
# Build application
bun run build

# Start with PM2
pm2 start bun --name drop-v2-api -- run start
pm2 save
pm2 startup
```

### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate

```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## Support and Resources

- **Documentation**: [Hono Framework](https://hono.dev)
- **Database**: [Prisma Docs](https://www.prisma.io/docs)
- **Payment**: [Razorpay Docs](https://razorpay.com/docs/)
- **Issue Tracking**: GitHub Issues

---

## License

MIT License - See LICENSE file for details
