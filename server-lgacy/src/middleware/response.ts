import { Context } from 'hono';

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  error: 'Validation Error';
  message: string;
  errors: ValidationError[];
  statusCode: 400;
}

// Success Response
export function successResponse<T>(
  c: Context,
  data: T,
  message?: string,
  statusCode: number = 200
) {
  return c.json<SuccessResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    statusCode
  );
}

// Error Response
export function errorResponse(
  c: Context,
  message: string,
  statusCode: number = 500,
  error: string = 'Internal Server Error'
) {
  return c.json<ErrorResponse>(
    {
      success: false,
      error,
      message,
      statusCode,
    },
    statusCode
  );
}

// Unauthorized Response
export function unauthorizedResponse(c: Context, message: string = 'Unauthorized') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Unauthorized',
      message,
      statusCode: 401,
    },
    401
  );
}

// Not Found Response
export function notFoundResponse(c: Context, message: string = 'Resource not found') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Not Found',
      message,
      statusCode: 404,
    },
    404
  );
}

// Server Error Response
export function serverErrorResponse(c: Context, message: string = 'Internal server error') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Internal Server Error',
      message,
      statusCode: 500,
    },
    500
  );
}

// Validation Error Response
export function validationErrorResponse(
  c: Context,
  errors: ValidationError[],
  message: string = 'Validation failed'
) {
  return c.json<ValidationErrorResponse>(
    {
      success: false,
      error: 'Validation Error',
      message,
      errors,
      statusCode: 400,
    },
    400
  );
}

// Paginated Response
export function paginatedResponse<T>(
  c: Context,
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return c.json<PaginatedResponse<T>>(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    },
    200
  );
}

// Helper to get pagination params from query
export function getPaginationParams(c: Context): { page: number; limit: number; skip: number } {
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '10', 10);

  // Ensure positive values
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit)); // Cap at 100

  const skip = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    skip,
  };
}

// Bad Request Response
export function badRequestResponse(c: Context, message: string = 'Bad request') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Bad Request',
      message,
      statusCode: 400,
    },
    400
  );
}

// Forbidden Response
export function forbiddenResponse(c: Context, message: string = 'Forbidden') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Forbidden',
      message,
      statusCode: 403,
    },
    403
  );
}

// Conflict Response
export function conflictResponse(c: Context, message: string = 'Resource already exists') {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Conflict',
      message,
      statusCode: 409,
    },
    409
  );
}
