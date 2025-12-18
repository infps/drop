import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';
import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import prisma from './prisma';

// In-memory OTP store (consider using Redis in production)
interface OTPRecord {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const otpStore = new Map<string, OTPRecord>();

// OTP Generation and Verification
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phone: string, otp: string): void {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '5');
  otpStore.set(phone, {
    phone,
    otp,
    expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    attempts: 0,
  });
}

export function verifyOTP(phone: string, otp: string): { valid: boolean; error?: string } {
  const record = otpStore.get(phone);

  if (!record) {
    return { valid: false, error: 'OTP not found. Please request a new one.' };
  }

  if (record.attempts >= 3) {
    otpStore.delete(phone);
    return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
  }

  if (new Date() > record.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, error: 'OTP expired. Please request a new one.' };
  }

  if (record.otp !== otp) {
    record.attempts++;
    return { valid: false, error: 'Invalid OTP. Please try again.' };
  }

  // OTP is valid, remove it
  otpStore.delete(phone);
  return { valid: true };
}

export function clearOTP(phoneNumber: string): void {
  otpStore.delete(phoneNumber);
}

// Password Hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT Token Generation and Verification
export interface JWTPayload {
  userId: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
  type?: 'user' | 'rider' | 'admin' | 'vendor';
  exp?: number;
  [key: string]: any;
}

// Helper to get JWT secret from environment
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

// Helper to convert expiry string to seconds
function parseExpiry(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    throw new Error('Invalid expiry format. Use format like: 7d, 24h, 30m, 60s');
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    's': 1,
    'm': 60,
    'h': 60 * 60,
    'd': 60 * 60 * 24,
  };

  return value * multipliers[unit];
}

export async function generateToken(payload: JWTPayload, expiresIn?: string): Promise<string> {
  const secret = getJWTSecret();
  const expiry = expiresIn || process.env.JWT_EXPIRES_IN || '7d';
  const exp = Math.floor(Date.now() / 1000) + parseExpiry(expiry);

  return await sign(
    { ...payload, exp },
    secret
  );
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret();
    const payload = await verify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract user from Authorization header or cookies
export async function getCurrentUser(c: Context): Promise<JWTPayload | null> {
  // Try Authorization header first
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (payload) {
      return payload;
    }
  }

  // Try multiple cookie names (auth-token, rider-token, admin-token)
  const authToken = getCookie(c, 'auth-token');
  const riderToken = getCookie(c, 'rider-token');
  const adminToken = getCookie(c, 'admin-token');
  const genericToken = getCookie(c, 'token');

  const cookieToken = authToken || riderToken || adminToken || genericToken;

  if (cookieToken) {
    const payload = await verifyToken(cookieToken);
    if (payload) {
      return payload;
    }
  }

  return null;
}

// Get full user from database
export async function getFullUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      wallet: true,
      subscription: true,
      loyaltyPoints: true,
    },
  });
}

// Get full rider from database
export async function getFullRider(riderId: string) {
  return prisma.rider.findUnique({
    where: { id: riderId },
  });
}

// Get full admin from database
export async function getFullAdmin(adminId: string) {
  return prisma.admin.findUnique({
    where: { id: adminId },
  });
}

// Cleanup expired OTPs periodically (run this on a schedule)
export function cleanupExpiredOTPs(): void {
  const now = new Date();
  for (const [phoneNumber, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
