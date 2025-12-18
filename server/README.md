# Drop V2 Server

A high-performance backend API server for the Drop delivery platform, built with Bun, Hono, and Prisma.

## Features

- **Fast Runtime**: Built on Bun for blazing-fast performance
- **Type-Safe ORM**: Prisma for type-safe database operations
- **Lightweight Framework**: Hono for minimal overhead and maximum speed
- **Authentication**: JWT-based auth with OTP verification
- **Payment Integration**: Razorpay payment gateway integration
- **File Uploads**: Multi-file upload support with cloud storage ready
- **Real-time Ready**: WebSocket support for live order tracking
- **Admin Dashboard**: Comprehensive admin routes for platform management
- **Wallet System**: Built-in wallet with transactions and refunds
- **Multi-tenant**: Support for users, riders, vendors, and admins

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.0+
- **Framework**: [Hono](https://hono.dev) v4.11+
- **ORM**: [Prisma](https://www.prisma.io) v7.1+
- **Database**: PostgreSQL 15+
- **Language**: TypeScript 5+

## Quick Start

### Prerequisites

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd v2/server

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
bun run setup

# Start development server
bun run dev
```

The server will start at `http://localhost:3001`

## Project Structure

```
v2/server/
├── src/
│   ├── index.ts                 # Entry point
│   ├── lib/
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── prisma.ts            # Prisma client
│   │   └── notifications.ts     # Notification utilities
│   ├── middleware/
│   │   ├── auth.ts              # Auth middleware
│   │   ├── logger.ts            # Request logger
│   │   ├── error-handler.ts    # Error handler
│   │   ├── response.ts          # Response helpers
│   │   └── static.ts            # Static file serving
│   └── routes/
│       ├── index.ts             # Routes index
│       ├── auth/                # Authentication routes
│       ├── admin/               # Admin routes
│       ├── orders/              # Order routes
│       ├── user/                # User routes
│       ├── rider/               # Rider routes
│       ├── vendor/              # Vendor routes
│       ├── products/            # Product routes
│       ├── cart/                # Cart routes
│       ├── payments/            # Payment routes
│       ├── wallet/              # Wallet routes
│       ├── upload/              # File upload routes
│       ├── search/              # Search routes
│       └── notifications/       # Notification routes
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── uploads/                     # Uploaded files directory
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── API_ROUTES.md               # API documentation
└── INTEGRATION_GUIDE.md        # Integration guide
```

## Environment Variables

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/drop_v2"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OTP
OTP_EXPIRY_MINUTES=5

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=10
BASE_URL=http://localhost:3001

# SMS (Optional)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Available Scripts

```bash
# Development
bun run dev              # Start dev server with hot reload

# Production
bun run start            # Start production server
bun run build            # Build for production

# Database
bun run db:generate      # Generate Prisma Client
bun run db:push          # Push schema to database
bun run db:migrate       # Run migrations
bun run db:studio        # Open Prisma Studio
bun run db:seed          # Seed database

# Setup
bun run setup            # Full setup (install + db setup)

# Testing & Linting
bun run test             # Run tests
bun run lint             # Type check with TypeScript
```

## API Endpoints

### Base URL
`http://localhost:3001/api/v1`

### Route Groups

| Group | Prefix | Description |
|-------|--------|-------------|
| Authentication | `/auth` | Login, OTP, logout |
| Orders | `/orders` | Order management |
| Users | `/user` | User profile & addresses |
| Riders | `/rider` | Rider operations |
| Vendors | `/vendor` | Vendor management |
| Products | `/products` | Product catalog |
| Cart | `/cart` | Shopping cart |
| Payments | `/payments` | Payment processing |
| Wallet | `/wallet` | Wallet operations |
| Admin | `/admin` | Admin dashboard |
| Upload | `/upload` | File uploads |
| Search | `/search` | Search functionality |
| Notifications | `/notifications` | User notifications |

For detailed API documentation, see [API_ROUTES.md](./API_ROUTES.md)

## Authentication

The API uses JWT tokens for authentication:

```javascript
// Include in requests
headers: {
  'Authorization': 'Bearer <token>'
}
```

### Auth Flow

1. **Send OTP**: `POST /auth/send-otp`
2. **Verify OTP**: `POST /auth/verify-otp` (returns JWT token)
3. **Use Token**: Include in subsequent requests
4. **Logout**: `POST /auth/logout`

## Database Schema

The database includes the following main models:

- **User**: End users of the platform
- **Rider**: Delivery partners
- **Vendor**: Restaurants/stores
- **Admin**: Platform administrators
- **Order**: Customer orders
- **Product**: Menu items/products
- **CartItem**: Shopping cart items
- **Wallet**: User wallets
- **WalletTransaction**: Wallet transactions
- **Notification**: User notifications
- **Zone**: Delivery zones
- **Address**: User addresses
- **Review**: Product/vendor reviews
- **Promotion**: Discount coupons
- **LoyaltyPoints**: User loyalty program

For complete schema, see [prisma/schema.prisma](./prisma/schema.prisma)

## Key Features

### 1. Admin Dashboard
- Real-time statistics
- User/rider/vendor management
- Order monitoring
- Payment tracking
- Zone management

### 2. Payment Integration
- Razorpay integration
- Payment verification
- Webhook support
- Refund processing

### 3. Wallet System
- Add money to wallet
- Deduct for orders
- Cashback rewards
- Transaction history
- Refund to wallet

### 4. File Upload
- Single/multiple file upload
- Image optimization ready
- Cloud storage integration ready
- Secure file handling

### 5. Real-time Features (Coming Soon)
- Order tracking
- Rider location updates
- Live notifications
- Chat support

## Performance Considerations

### Pagination
All list endpoints support pagination:
```javascript
GET /api/v1/orders?page=1&limit=20
```

### Caching
Implement caching for frequently accessed data:
- Vendor lists
- Product catalogs
- Static content

### Database Optimization
- Indexed queries
- Efficient joins
- Query optimization with Prisma

### Rate Limiting
Recommended limits:
- Auth endpoints: 5 req/min
- General endpoints: 100 req/min
- Upload endpoints: 10 req/min

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

## Integration

### React Native
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const orders = await api.get('/orders');
```

### React Web
```javascript
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: () => api.get('/orders')
});
```

For complete integration guide, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Testing

```bash
# Run tests
bun test

# Test specific file
bun test src/routes/auth/verify-otp.test.ts

# Watch mode
bun test --watch
```

## Deployment

### Docker

```bash
# Build image
docker build -t drop-v2-api .

# Run container
docker run -p 3001:3001 drop-v2-api
```

### Production Server

```bash
# Using PM2
pm2 start bun --name drop-api -- run start

# Using systemd
sudo systemctl start drop-api
```

### Environment
- Use production database
- Set `NODE_ENV=production`
- Use secure `JWT_SECRET`
- Enable SSL/TLS
- Configure proper CORS
- Set up monitoring

## Monitoring

Recommended tools:
- **Sentry**: Error tracking
- **DataDog**: APM monitoring
- **PM2**: Process management
- **Prometheus**: Metrics collection

## Security

- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention (Prisma)
- CORS configuration
- Input validation
- Rate limiting (recommended)
- Helmet for security headers

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- GitHub Issues
- Email: support@drop.com
- Documentation: [API_ROUTES.md](./API_ROUTES.md)

## Roadmap

- [ ] WebSocket real-time updates
- [ ] GraphQL API
- [ ] Redis caching layer
- [ ] Elasticsearch integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Microservices architecture
- [ ] gRPC support

---

Built with ❤️ using [Bun](https://bun.sh) and [Hono](https://hono.dev)
