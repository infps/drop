import { Context, Next, MiddlewareHandler } from 'hono';
import { getCurrentUser, JWTPayload } from '../lib/auth';
import { unauthorizedResponse, forbiddenResponse } from './response';

// Extend Hono's context with user data
declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header or cookies
 * Sets user data in context.user if valid
 */
export const requireAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const user = await getCurrentUser(c);

  if (!user) {
    return unauthorizedResponse(c, 'Authentication required');
  }

  // Set user in context for use in route handlers
  c.set('user', user);
  await next();
};

/**
 * Optional Authentication Middleware
 * Attempts to authenticate but allows request to continue if not authenticated
 * Sets user data in context if token is valid
 */
export const optionalAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const user = await getCurrentUser(c);

  if (user) {
    c.set('user', user);
  }

  await next();
};

/**
 * Role-based Access Control Middleware
 * Requires authentication and checks if user has one of the allowed types
 */
export function requireRole(...allowedTypes: Array<'user' | 'rider' | 'admin' | 'vendor'>): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    if (!user.type || !allowedTypes.includes(user.type)) {
      return forbiddenResponse(
        c,
        `Access denied. Required role: ${allowedTypes.join(' or ')}`
      );
    }

    // Set user in context
    c.set('user', user);
    await next();
  };
}

/**
 * Admin-only Access Middleware
 * Shortcut for requireRole('admin')
 */
export const requireAdmin: MiddlewareHandler = requireRole('admin');

/**
 * Rider-only Access Middleware
 * Shortcut for requireRole('rider')
 */
export const requireRider: MiddlewareHandler = requireRole('rider');

/**
 * User-only Access Middleware
 * Shortcut for requireRole('user')
 */
export const requireUser: MiddlewareHandler = requireRole('user');

/**
 * Custom verification middleware
 * Checks if user meets custom conditions
 */
export function requireCondition(
  condition: (user: JWTPayload) => boolean,
  errorMessage: string = 'Access denied'
): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const user = await getCurrentUser(c);

    if (!user) {
      return unauthorizedResponse(c, 'Authentication required');
    }

    if (!condition(user)) {
      return forbiddenResponse(c, errorMessage);
    }

    c.set('user', user);
    await next();
  };
}

/**
 * KYC Verification Middleware
 * Requires user to be KYC verified
 */
export const requireKYC: MiddlewareHandler = requireCondition(
  (user) => user.isKycVerified === true,
  'KYC verification required'
);

/**
 * Age Verification Middleware
 * Requires user to be age verified (for alcohol/tobacco products)
 */
export const requireAgeVerified: MiddlewareHandler = requireCondition(
  (user) => user.isAgeVerified === true,
  'Age verification required for this product'
);

/**
 * Helper to get current user from context
 * Use this in route handlers after authentication middleware
 */
export function getUser(c: Context): JWTPayload {
  const user = c.get('user');
  if (!user) {
    throw new Error('User not found in context. Did you forget to use requireAuth middleware?');
  }
  return user;
}
