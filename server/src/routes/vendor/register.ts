import { Hono } from 'hono';
import { generateOTP, storeOTP } from '../../lib/auth';
import { sendOTPSMS } from '../../lib/notifications';
import {
  successResponse,
  errorResponse,
  badRequestResponse,
} from '../../middleware/response';
import prisma from '../../lib/prisma';

const app = new Hono();

const VALID_VENDOR_TYPES = [
  'RESTAURANT',
  'GROCERY',
  'WINE_SHOP',
  'PHARMACY',
  'MEAT_SHOP',
  'MILK_DAIRY',
  'PET_SUPPLIES',
  'FLOWERS',
  'GENERAL_STORE',
];

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      businessName,
      businessType,
      cuisineTypes = [],
      description,
      ownerName,
      phone,
      alternatePhone,
      email,
      gstNumber,
      fssaiNumber,
      panNumber,
      bankAccount,
      ifscCode,
      address,
      city,
      pincode,
      landmark,
      latitude,
      longitude,
      openingTime,
      closingTime,
      avgPrepTime = 30,
      minimumOrder = 0,
      deliveryRadius = 5,
    } = body;

    // Validate phone number
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return badRequestResponse(c, 'Invalid phone number');
    }

    // Validate required fields
    const required = [
      'businessName',
      'businessType',
      'ownerName',
      'phone',
      'email',
      'address',
      'city',
      'pincode',
      'openingTime',
      'closingTime',
    ];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return badRequestResponse(c, `Missing: ${missing.join(', ')}`);
    }

    // Validate businessType
    if (!VALID_VENDOR_TYPES.includes(businessType)) {
      return badRequestResponse(c, `Invalid businessType. Must be: ${VALID_VENDOR_TYPES.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequestResponse(c, 'Invalid email format');
    }

    // Check for existing vendor
    const existing = await prisma.vendor.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existing) {
      return errorResponse(c, 'Vendor with this email or phone already exists', 409);
    }

    // Create vendor
    const vendor = await prisma.vendor.create({
      data: {
        name: businessName,
        type: businessType,
        description,
        cuisineTypes,
        ownerName,
        phone,
        alternatePhone,
        email,
        gstNumber,
        fssaiNumber,
        panNumber,
        bankAccount,
        ifscCode,
        address,
        city,
        pincode,
        landmark,
        latitude: latitude || 0,
        longitude: longitude || 0,
        openingTime,
        closingTime,
        avgPrepTime,
        minimumOrder,
        deliveryRadius,
        status: 'PENDING',
        isVerified: false,
        isActive: false,
      },
    });

    // Generate and send OTP for phone verification
    const otp = generateOTP();
    storeOTP(phone, otp);
    const otpSent = await sendOTPSMS(phone, otp);

    const response: Record<string, unknown> = {
      message: 'Registration submitted. Please verify your phone.',
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        status: vendor.status,
        type: vendor.type,
        isVerified: vendor.isVerified,
      },
      otpSent,
    };

    if (process.env.NODE_ENV === 'development') {
      response.otp = otp;
    }

    return successResponse(c, response, 'Vendor registered. Verify phone.', 201);
  } catch (error) {
    console.error('Vendor registration error:', error);
    return errorResponse(c, 'Failed to register vendor', 500);
  }
});

export default app;
