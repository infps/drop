// Phone Number Validation
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid length (10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }

  // Basic pattern check (starts with country code or local format)
  const phonePattern = /^(\+?\d{1,3})?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
  return phonePattern.test(phoneNumber) || /^\d{10,15}$/.test(cleaned);
}

// Format phone number to E.164 format
export function formatPhoneNumber(phoneNumber: string, defaultCountryCode: string = '+1'): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10) {
    return `${defaultCountryCode}${cleaned}`;
  }

  return phoneNumber.startsWith('+') ? phoneNumber : `+${cleaned}`;
}

// Email Validation
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Password Validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string, minLength: number = 8): PasswordValidation {
  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// OTP Validation
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

// Name Validation
export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s'-]+$/.test(name);
}

// URL Validation
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// UUID Validation
export function isValidUUID(uuid: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

// Sanitize String (remove HTML tags and trim)
export function sanitizeString(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

// Validate required fields
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === ''
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Validate Date
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Validate Future Date
export function isFutureDate(dateString: string): boolean {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  return date > new Date();
}

// Validate Past Date
export function isPastDate(dateString: string): boolean {
  if (!isValidDate(dateString)) return false;
  const date = new Date(dateString);
  return date < new Date();
}

// Validate Number Range
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// Validate Positive Number
export function isPositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

// Validate Integer
export function isInteger(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num);
}

// Validate Latitude
export function isValidLatitude(lat: number): boolean {
  return isInRange(lat, -90, 90);
}

// Validate Longitude
export function isValidLongitude(lng: number): boolean {
  return isInRange(lng, -180, 180);
}

// Validate Coordinates
export function isValidCoordinates(lat: number, lng: number): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng);
}

// Validate JSON String
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Validate Array (non-empty)
export function isNonEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// Validate Enum Value
export function isValidEnumValue<T>(value: T, enumObj: Record<string, T>): boolean {
  return Object.values(enumObj).includes(value);
}
