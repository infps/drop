import { Hono } from 'hono';
import { generateOTP, storeOTP } from '../../lib/auth';
import { sendOTPSMS } from '../../lib/notifications';
import { successResponse, errorResponse } from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { phone, type = 'user' } = body;

    // Validate phone number (10 digits, starts with 6-9)
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return errorResponse(
        c,
        'Invalid phone number. Must be a 10-digit Indian mobile number.',
        400,
        'Bad Request'
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(phone, otp);

    // Send OTP via SMS
    const sent = await sendOTPSMS(phone, otp);

    if (!sent) {
      return errorResponse(
        c,
        'Failed to send OTP. Please try again.',
        500,
        'Internal Server Error'
      );
    }

    // Check if user/vendor exists
    let isNewUser = false;
    let isNewVendor = false;
    if (type === 'user') {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });
      isNewUser = !existingUser;
    } else if (type === 'vendor') {
      const existingVendor = await prisma.vendor.findFirst({
        where: { phone },
      });
      isNewVendor = !existingVendor;
    }

    // In development, include OTP in response for testing
    const response: Record<string, unknown> = {
      message: 'OTP sent successfully',
      isNewUser,
      isNewVendor,
    };

    if (process.env.NODE_ENV === 'development') {
      response.otp = otp;
    }

    return successResponse(c, response);
  } catch (error) {
    console.error('Send OTP error:', error);
    return errorResponse(
      c,
      'Failed to send OTP. Please try again later.',
      500,
      'Internal Server Error'
    );
  }
});

export default app;
