import type { ErrorHandler } from 'hono'

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('Error:', err)

  // Check if it's a known error type
  if (err.message) {
    return c.json(
      {
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      err.status || 500
    )
  }

  // Default error response
  return c.json(
    {
      status: 'error',
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { error: String(err) }),
    },
    500
  )
}
