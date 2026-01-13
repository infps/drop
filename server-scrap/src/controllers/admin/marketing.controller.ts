import type { Context } from 'hono'

export async function campaigns(c: Context<any>) {
  return c.success([])
}

export async function coupons(c: Context<any>) {
  return c.success([])
}

export async function referrals(c: Context<any>) {
  return c.success({ enabled: true, referrerReward: 100, refereeReward: 50 })
}

export async function notifications(c: Context<any>) {
  return c.success({ sent: 0 })
}
