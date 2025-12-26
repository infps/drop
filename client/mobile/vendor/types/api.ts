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
  vendor?: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    logo?: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  type: 'vendor';
}

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}
