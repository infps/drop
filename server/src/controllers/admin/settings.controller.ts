import type { Context } from 'hono'

export async function general(c: Context<any>) {
  return c.success({
    platformName: 'Drop',
    supportEmail: 'support@drop.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  })
}

export async function payments(c: Context<any>) {
  return c.success({
    enabledMethods: ['CARD', 'UPI', 'WALLET', 'COD'],
    cod: { enabled: true, maxAmount: 5000 },
  })
}

export async function notifications(c: Context<any>) {
  return c.success({ enabled: true })
}

export async function features(c: Context<any>) {
  return c.success({ partyMode: true, genieService: true })
}
