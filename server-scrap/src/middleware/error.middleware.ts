import type { Context } from 'hono'
import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler: ErrorHandler = (err, c) => {
  // Handle HTTPException (from JWT middleware, etc.)
  if (err instanceof HTTPException) {
    // Only log unexpected errors (not auth/validation failures)
    if (err.status >= 500) {
      console.error('[ERROR]', err)
    }
    return c.json(
      {
        status: 'error',
        message: err.message,
      },
      err.status
    )
  }

  // Log all non-HTTP exceptions
  console.error('[ERROR]', err)

  // Drizzle unique constraint errors
  if (err.message.includes('unique constraint') || err.message.includes('duplicate key')) {
    return c.json(
      {
        status: 'error',
        message: 'Resource already exists',
        error: err.message,
      },
      409
    )
  }

  // JWT errors
  if (err.message.includes('jwt') || err.message.includes('token')) {
    return c.json(
      {
        status: 'error',
        message: 'Invalid or expired token',
        error: err.message,
      },
      401
    )
  }

  // Not found errors
  if (err.message.includes('not found')) {
    return c.json(
      {
        status: 'error',
        message: 'Resource not found',
        error: err.message,
      },
      404
    )
  }

  // Default 500
  return c.json(
    {
      status: 'error',
      message: 'Internal server error',
      error: err.message,
    },
    500
  )
}
