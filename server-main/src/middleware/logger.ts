import type { MiddlewareHandler } from 'hono'

export const logger: MiddlewareHandler = async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path

  await next()

  const status = c.res.status
  const elapsed = Date.now() - start

  // Color codes for different status codes
  const statusColor = status >= 500 ? '\x1b[31m' // red
    : status >= 400 ? '\x1b[33m' // yellow
    : status >= 300 ? '\x1b[36m' // cyan
    : status >= 200 ? '\x1b[32m' // green
    : '\x1b[0m' // default

  const reset = '\x1b[0m'
  const methodColor = '\x1b[35m' // magenta

  console.log(
    `${methodColor}${method}${reset} ${path} ${statusColor}${status}${reset} ${elapsed}ms`
  )
}
