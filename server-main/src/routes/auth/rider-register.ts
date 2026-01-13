import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { generateToken, hashPassword } from '../../lib/auth';
import { successResponse, errorResponse } from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      phone,
      name,
      email,
      vehicleType,
      vehicleNumber,
    } = body;

    // Validate required fields
    if (!phone || !name || !vehicleType) {
      return errorResponse(
        c,
        'Phone, name, and vehicle type are required',
        400,
        'Bad Request'
      );
    }

    // Check if rider already exists
    const existingRider = await prisma.rider.findUnique({
      where: { phone },
    });

    if (existingRider) {
      return errorResponse(
        c,
        'Rider with this phone number already exists',
        409,
        'Conflict'
      );
    }

    // Create new rider
    const rider = await prisma.rider.create({
      data: {
        phone,
        name,
        email: email || null,
        vehicleType,
        vehicleNumber: vehicleNumber || null,
        isOnline: false,
        isAvailable: true,
        documentVerified: false,
        rating: 5.0,
        totalDeliveries: 0,
        totalEarnings: 0,
      },
    });

    // Generate token
    const token = await generateToken({
      userId: rider.id,
      phone: rider.phone,
      type: 'rider',
    }, '7d');

    // Set cookie
    setCookie(c, 'rider-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return successResponse(c, {
      message: 'Rider registered successfully',
      token,
      rider: {
        id: rider.id,
        phone: rider.phone,
        name: rider.name,
        email: rider.email,
        vehicleType: rider.vehicleType,
        avatar: rider.avatar,
      },
    }, 201);
  } catch (error) {
    console.error('Rider registration error:', error);
    return errorResponse(
      c,
      'Failed to register rider. Please try again.',
      500,
      'Internal Server Error'
    );
  }
});

export default app;
