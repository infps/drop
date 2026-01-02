/* eslint-disable @typescript-eslint/no-explicit-any */
import 'hono'

declare module 'hono' {
  interface Context<E = any, P = any, I = any> {
    success: (data: any, message?: string) => Response
    sendError: (message: string, code?: number) => Response
    paginated: (data: any[], total: number, page: number, limit: number) => Response
  }
}
