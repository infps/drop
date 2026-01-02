import { createMiddleware } from 'hono/factory'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import '@/types/hono.d'

export const responseHelpers = createMiddleware(async (c, next) => {
  ;(c as any).success = (data: any, message?: string) =>
    c.json({ status: 'success', data, message })

  ;(c as any).sendError = (message: string, code = 400) =>
    c.json({ status: 'error', message }, code as ContentfulStatusCode)

  ;(c as any).paginated = (data: any[], total: number, page: number, limit: number) =>
    c.json({
      status: 'success',
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })

  await next()
})
