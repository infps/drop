export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth types
export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  rider?: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    avatar?: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  type: 'rider' | 'user' | 'vendor' | 'admin';
}

// API request config
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}
