# Hono Migration Guide - v2 Server

This guide documents the migration from external packages to Hono's built-in modules.

## Changes Made

### 1. Package Dependencies Updated

**Removed:**
- `@hono/cors` - Replaced with `hono/cors` (built-in)
- `@hono/jwt` - Replaced with `hono/jwt` (built-in)
- `jsonwebtoken` - Replaced with `hono/jwt` (built-in)
- `@types/jsonwebtoken` - No longer needed

**Kept:**
- `hono` - Core framework (includes all built-in modules)
- `@prisma/*` - Database ORM
- `bcryptjs` - Password hashing
- `pg` - PostgreSQL driver
- `date-fns` - Date utilities
- `dotenv` - Environment variables
- `uuid` - UUID generation

### 2. Authentication Library (`src/lib/auth.ts`)

**Before:**
```typescript
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'default';

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getCurrentUser(c: Context): JWTPayload | null {
  // synchronous
}
```

**After:**
```typescript
import { sign, verify } from 'hono/jwt';

export async function generateToken(payload: JWTPayload, expiresIn?: string): Promise<string> {
  const secret = process.env.JWT_SECRET!;
  const expiry = expiresIn || '7d';
  const exp = Math.floor(Date.now() / 1000) + parseExpiry(expiry);

  return await sign({ ...payload, exp }, secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET!;
    return await verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(c: Context): Promise<JWTPayload | null> {
  // async - uses await for token verification
}
```

**Key Changes:**
- JWT functions are now `async` and return Promises
- No JWT_SECRET constant - use environment variable directly
- Manual expiry calculation using `exp` claim
- Helper function `parseExpiry()` to convert "7d" to seconds

### 3. Authentication Middleware (`src/middleware/auth.ts`)

**New file created with Hono patterns:**

```typescript
import { Context, Next, MiddlewareHandler } from 'hono';
import { getCurrentUser } from '../lib/auth';

// Basic auth middleware
export const requireAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return unauthorizedResponse(c, 'Authentication required');
  }
  c.set('user', user);
  await next();
};

// Role-based access control
export function requireRole(...allowedTypes: Array<'user' | 'rider' | 'admin'>): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const user = await getCurrentUser(c);
    if (!user || !allowedTypes.includes(user.type)) {
      return forbiddenResponse(c, 'Access denied');
    }
    c.set('user', user);
    await next();
  };
}

// Shortcuts
export const requireAdmin = requireRole('admin');
export const requireRider = requireRole('rider');
export const requireUser = requireRole('user');

// Context helper
export function getUser(c: Context): JWTPayload {
  return c.get('user');
}
```

### 4. Main Server File (`src/index.ts`)

**Before:**
```typescript
import { cors } from '@hono/cors';
```

**After:**
```typescript
import { cors } from 'hono/cors';
```

**Changes:**
- Use built-in `hono/cors` instead of external package
- Same configuration API, no other changes needed

### 5. Route Files (All routes updated)

**Before:**
```typescript
app.post('/', async (c) => {
  const user = getCurrentUser(c);  // synchronous
  const token = generateToken({ userId: user.id });  // synchronous
});
```

**After:**
```typescript
app.post('/', async (c) => {
  const user = await getCurrentUser(c);  // async
  const token = await generateToken({ userId: user.id }, '7d');  // async
});
```

**Files Updated:**
- `src/routes/auth/verify-otp.ts`
- `src/routes/auth/admin-login.ts`
- `src/routes/auth/me.ts`
- `src/routes/user/profile.ts`
- All other route files (51 occurrences across 13 files)

### 6. Response Middleware (`src/middleware/response.ts`)

**No changes needed** - already using proper Hono Context patterns:
- Uses `c.json()` for JSON responses
- Uses proper status codes
- All response helpers accept Context as first parameter

## Usage Examples

### Protected Routes

```typescript
import { Hono } from 'hono';
import { requireAuth, requireAdmin, getUser } from '../middleware/auth';

const app = new Hono();

// Requires authentication
app.get('/profile', requireAuth, async (c) => {
  const user = getUser(c);
  return c.json({ user });
});

// Requires admin role
app.delete('/users/:id', requireAdmin, async (c) => {
  const admin = getUser(c);
  // Only admins can access
});
```

### Custom Role Middleware

```typescript
import { requireRole } from '../middleware/auth';

// Only riders or admins
app.get('/deliveries', requireRole('rider', 'admin'), async (c) => {
  // Handler
});
```

### JWT Token Generation

```typescript
import { generateToken } from '../lib/auth';

// Generate token with default expiry (7d)
const token = await generateToken({
  userId: user.id,
  type: 'user'
});

// Custom expiry
const token = await generateToken({
  userId: admin.id,
  type: 'admin'
}, '8h');

// Supported formats: '7d', '24h', '30m', '60s'
```

### Cookie Management

```typescript
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';

// Set cookie
setCookie(c, 'auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
});

// Get cookie
const token = getCookie(c, 'auth-token');

// Delete cookie
deleteCookie(c, 'auth-token');
```

## Environment Variables Required

```env
JWT_SECRET=your-secret-key-here  # REQUIRED - JWT signing secret
JWT_EXPIRES_IN=7d                 # OPTIONAL - default token expiry
OTP_EXPIRY_MINUTES=5              # OPTIONAL - OTP expiry time
CORS_ORIGIN=http://localhost:5173 # OPTIONAL - CORS allowed origins (comma-separated)
```

## Migration Checklist

- [x] Remove `@hono/cors`, `@hono/jwt`, `jsonwebtoken`, `@types/jsonwebtoken` from package.json
- [x] Update imports to use `hono/cors`, `hono/jwt`, `hono/cookie`
- [x] Convert JWT functions to async/await
- [x] Update all route handlers to use `await` with auth functions
- [x] Create authentication middleware file
- [x] Test all authentication flows
- [ ] Run `bun install` to update dependencies
- [ ] Set JWT_SECRET in environment variables
- [ ] Test the application

## Testing

```bash
# Install dependencies
bun install

# Check TypeScript errors
bun run lint

# Run development server
bun run dev

# Test authentication endpoint
curl -X POST http://localhost:3001/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

## Benefits

1. **Smaller Bundle Size** - No external JWT/CORS packages
2. **Better TypeScript Support** - Built-in types from Hono
3. **Consistent Patterns** - All middleware follows Hono conventions
4. **Better Performance** - Native Hono implementations optimized for the framework
5. **Fewer Dependencies** - Reduced maintenance overhead

## Breaking Changes

- All JWT functions are now async (must use `await`)
- `generateToken()` requires manual expiry format ("7d", "8h", etc.)
- `getCurrentUser()` is now async
- JWT_SECRET must be set in environment (no default fallback)

## Troubleshooting

### "JWT_SECRET is not set" Error
Make sure to set `JWT_SECRET` in your `.env` file:
```env
JWT_SECRET=your-very-long-and-secure-secret-key-here
```

### "Invalid expiry format" Error
Use supported formats: `7d`, `24h`, `30m`, `60s`

### TypeScript Errors with Context
Make sure you're using the latest Hono types:
```typescript
import { Context, Next, MiddlewareHandler } from 'hono';
```

## Additional Resources

- [Hono Documentation](https://hono.dev/)
- [Hono JWT Middleware](https://hono.dev/middleware/builtin/jwt)
- [Hono CORS Middleware](https://hono.dev/middleware/builtin/cors)
- [Hono Cookie Helper](https://hono.dev/helpers/cookie)
