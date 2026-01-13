import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
})
