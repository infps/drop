import type { Context } from 'hono'

export async function assignment(c: Context<any>) {
  return c.success({
    enabled: true,
    maxDistance: 5,
    maxWaitTime: 120,
    prioritizeRating: true,
    prioritizeProximity: true,
  })
}

export async function fraud(c: Context<any>) {
  return c.success([])
}

export async function demand(c: Context<any>) {
  return c.success([])
}

export async function personalization(c: Context<any>) {
  return c.success({ enabled: true })
}
