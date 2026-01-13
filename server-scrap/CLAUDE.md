# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev
bun run dev                # Start dev server (port 3000, hot reload)

# Database
bun run db:generate        # Generate Drizzle migration files
bun run db:migrate         # Apply migrations to DB
bun run db:all             # Generate + migrate in one command
bun run db:up              # Open Drizzle Studio (DB GUI)
bun run db:seed            # Seed admin data
bun run seed-riders.ts     # Seed rider test data

# Testing
bun test
```

## Architecture

### Tech Stack
- **Runtime**: Bun
- **Framework**: Hono (web framework)
- **ORM**: Drizzle ORM
- **DB**: PostgreSQL (Neon serverless)
- **Auth**: JWT via `hono/jwt`

### Directory Structure
```
src/
├── index.ts              # App entry, middleware setup
├── routes/               # Route definitions (domain-organized)
│   ├── admin/
│   │   ├── index.ts      # Route aggregator + auth/audit middleware
│   │   ├── *.route.ts    # Individual route files
│   │   └── {domain}/     # Complex domains get folders (finance/, analytics/, etc.)
│   └── rider/
│       ├── index.ts      # Route aggregator + rider auth
│       └── *.route.ts    # location, earnings, orders
├── controllers/          # Business logic (matches route structure)
│   ├── admin/
│   │   └── *.controller.ts
│   └── rider/
│       └── *.controller.ts
├── db/
│   ├── index.ts          # Drizzle client export
│   ├── schema.ts         # Re-exports all schemas
│   ├── schemas/          # Domain-organized schema models
│   │   ├── user/
│   │   ├── vendor/
│   │   ├── rider/
│   │   ├── order/
│   │   ├── rms/          # Restaurant Management System schemas
│   │   │   ├── menu/
│   │   │   ├── dine-in/
│   │   │   ├── kds/      # Kitchen Display System
│   │   │   ├── inventory/
│   │   │   ├── procurement/
│   │   │   └── ...       # staff/, crm/, loyalty/, gift-card/, etc.
│   │   └── enums.ts
│   └── actions/          # Database query functions (organized by domain)
│       ├── admin/
│       │   └── *.action.ts
│       └── rider/
│           └── *.action.ts
├── middleware/
│   ├── auth.middleware.ts      # JWT validation + role-based access
│   ├── audit.middleware.ts     # Admin action logging
│   ├── cors.middleware.ts
│   ├── error.middleware.ts
│   └── response.middleware.ts  # Adds c.success(), c.sendError(), c.paginated()
├── helpers/              # Utility functions
│   └── auth.helper.ts    # Token generation, password hashing
└── types/                # TypeScript type definitions (domain-organized)
    ├── hono.d.ts         # Hono context extensions
    ├── admin.types.ts    # Admin types
    ├── rider.types.ts    # Rider types
    └── *.types.ts        # Other domain types
```

### Request Flow
1. `src/index.ts` - Global middleware (logger, CORS, response helpers)
2. Route modules (e.g., `/admin`) apply domain-specific middleware (auth, audit)
3. Individual routes call controller functions
4. Controllers use `db/actions` for queries
5. Response via `c.success()`, `c.sendError()`, or `c.paginated()`

### Response Format
All API responses use standardized format from `response.middleware.ts`:
```ts
c.success(data, message?)       // { status: 'success', data, message? }
c.sendError(message, code?)     // { status: 'error', message }
c.paginated(data, total, page, limit)  // { status: 'success', data, pagination: {...} }
```

### Auth Pattern
JWT-based with role checking:
```ts
import { adminAuth, riderAuth } from '@/middleware/auth.middleware'

// Admin auth - require valid JWT
app.get('/protected', adminAuth(), handler)

// Admin auth - require specific roles
app.delete('/critical', adminAuth(['SUPER_ADMIN']), handler)

// Rider auth
app.get('/rider-protected', riderAuth(), handler)

// Access payload in controller
const adminPayload = c.get('jwtPayload') as AdminPayload  // { id, role }
const riderPayload = c.get('jwtPayload') as RiderPayload  // { id, type: 'rider' }
```

### Database Schemas
Organized by domain with Drizzle ORM:
- Core delivery: `user`, `vendor`, `rider`, `order`, `product`
- Genie/Porter: `genie-order`, `genie-stop`
- Party mode: `party-event`, `party-participant`
- RMS (Restaurant Management):
  - **Dine-in**: tables, reservations, waitlist, split bills
  - **Menu**: menu sets, items, modifiers, outlet assignments
  - **KDS**: kitchen stations, tickets, routing rules
  - **Inventory**: items, stock movements, batches, transfers
  - **Procurement**: suppliers, POs, goods receipts, invoices
  - **Staff**: employees, schedules, time entries, tip pools
  - **CRM**: guest profiles, feedback, loyalty programs
- Support: `support-ticket`, `ticket-message`
- Admin: `admin`, `audit-log`, `zone`, `system-config`

All schemas export from `src/db/schema.ts` for Drizzle Kit.

## Code Conventions

### File Organization (CRITICAL)
- **Routes & Controllers**: Follow strict folder/file segregation by separation of concerns
  - Simple domains: single `.route.ts` + `.controller.ts` files
  - Complex domains: folder with `index.ts` + feature-specific files
  - Example: `routes/admin/finance/` has `index.ts`, while `routes/admin/auth.route.ts` is standalone
  - Controllers MUST mirror route structure exactly

### Path Aliases
Use `@/` for imports (defined in `tsconfig.json`):
```ts
import { db } from '@/db'
import { adminAuth } from '@/middleware/auth.middleware'
```

### Database Actions
Centralize queries in `src/db/actions/{domain}/*.action.ts`:
```ts
// actions/admin/auth.action.ts
export async function validateAdmin(email: string, password: string) {
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1)
  // ... validation logic
}
```

### Middleware Composition
Apply middleware at appropriate scope:
- Global: `app.use('*', middleware)` in `src/index.ts`
- Domain: Route aggregator (e.g., `routes/admin/index.ts`)
- Specific routes: Individual route definitions

## Environment Variables
See `.env.example`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `PORT` - Server port (default 3000)
- `JWT_SECRET` - Min 32 chars
- `JWT_EXPIRY` - Token expiry (default 24h)
- `CORS_ORIGIN` - Allowed origins
- `NODE_ENV` - development/production

## API Routes

### Admin Routes (`/admin`)
Protected by `adminAuth()` with role-based access.
- `/auth` - Login, logout, me
- `/dashboard` - Stats, analytics
- `/users` - User management
- `/vendors` - Vendor management
- `/riders` - Rider management
- `/orders` - Order management
- `/zones` - Zone configuration
- `/inventory` - Inventory management
- `/finance` - Financial operations
- `/analytics` - Reports & analytics
- `/marketing` - Campaigns & promotions
- `/settings` - System settings

### Rider Routes (`/rider`)
Protected by `riderAuth()`. All authenticated with rider JWT.

#### Location Management
- `POST /rider/location` - Update rider location & online status
  - Input: `{ latitude, longitude, isOnline? }`
  - Syncs location to active orders (PICKED_UP, OUT_FOR_DELIVERY)
- `GET /rider/location` - Get rider status & location
  - Returns: online/available status, coordinates, zone, active order count

#### Earnings
- `GET /rider/earnings` - Get earnings summary & history
  - Query: `period` (today/week/month/all), `page`, `limit`
  - Returns: summary (base, tips, incentives, penalties), paginated list, lifetime stats

#### Orders
- `GET /rider/orders` - List orders
  - Query: `type` (available/active/completed), `page`, `limit`
  - `available`: READY_FOR_PICKUP orders without rider
  - `active`: Rider's PICKED_UP or OUT_FOR_DELIVERY orders
  - `completed`: Rider's DELIVERED orders
  - Returns: paginated orders with vendor, address, items, user info

- `POST /rider/orders` - Order actions
  - Input: `{ orderId, action }`
  - Actions:
    - `accept`: Accept available order → PICKED_UP
    - `pickup`: Mark as out for delivery → OUT_FOR_DELIVERY
    - `deliver`: Complete delivery → DELIVERED (creates earning, updates stats)
  - Earnings: 80% of deliveryFee + full tip

### Business Rules (Rider)
- **Location Sync**: Updates sync to all active orders for real-time tracking
- **Order State**: READY_FOR_PICKUP → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED
- **Earnings**: Created on delivery completion (base = 80% fee, total = base + tip)
- **Stats Update**: totalDeliveries +1, totalEarnings +earning on each delivery
- **COD Payment**: paymentStatus set to COMPLETED on delivery

### Testing
```bash
# Seed rider test data
bun run seed-riders.ts

# Run all tests
bun test

# Run rider tests only
bun test tests/rider
```

Test data includes 3 riders, 2 users, 2 vendors, orders in various states.
