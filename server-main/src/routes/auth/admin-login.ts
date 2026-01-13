import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { generateToken, hashPassword, verifyPassword } from '../../lib/auth';
import { successResponse, errorResponse, forbiddenResponse } from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, action } = body;

    if (!email || !password) {
      return errorResponse(
        c,
        'Email and password are required',
        400,
        'Bad Request'
      );
    }

    if (action === 'register') {
      // Only allow registration in development or by super admin
      if (process.env.NODE_ENV !== 'development') {
        return forbiddenResponse(c, 'Registration not allowed');
      }

      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        return errorResponse(
          c,
          'Admin already exists',
          400,
          'Bad Request'
        );
      }

      const hashedPassword = await hashPassword(password);
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          role: 'ADMIN',
        },
      });

      return successResponse(c, {
        message: 'Admin created successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    }

    // Login
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return errorResponse(
        c,
        'Invalid credentials',
        401,
        'Unauthorized'
      );
    }

    if (!admin.isActive) {
      return forbiddenResponse(c, 'Account is disabled');
    }

    const isValidPassword = await verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return errorResponse(
        c,
        'Invalid credentials',
        401,
        'Unauthorized'
      );
    }

    // Generate token with 8 hours expiry for admin
    const token = await generateToken({
      userId: admin.id,
      email: admin.email,
      type: 'admin',
    }, '8h');

    // Set cookie
    setCookie(c, 'admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    // Log audit
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN',
        entity: 'admin',
        entityId: admin.id,
        details: {
          ip,
          userAgent,
        },
      },
    });

    return successResponse(c, {
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return errorResponse(
      c,
      'Authentication failed',
      500,
      'Internal Server Error'
    );
  }
});

export default app;
