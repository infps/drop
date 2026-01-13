import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, setAuthToken } from '../setup'
import { sign } from 'hono/jwt'
import { db } from '../../src/db'
import { riders } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

const RIDER_BASE = '/rider'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long'

describe('Rider Earnings Routes', () => {
  let riderToken = ''
  let riderId = ''

  beforeAll(async () => {
    // Get actual rider from DB
    const [rider] = await db
      .select()
      .from(riders)
      .where(eq(riders.phone, '+919876550001'))
      .limit(1)

    if (!rider) {
      throw new Error('Test rider not found. Run: bun run seed-riders.ts')
    }

    riderId = rider.id

    // Generate rider JWT token
    riderToken = await sign(
      {
        id: riderId,
        type: 'rider' as const,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      JWT_SECRET
    )
    setAuthToken(riderToken)
  })

  test('GET /rider/earnings - should get earnings with default params', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data).toHaveProperty('summary')
    expect(data.data).toHaveProperty('earnings')
    expect(data.data).toHaveProperty('lifetime')

    // Summary structure
    expect(data.data.summary).toHaveProperty('baseEarning')
    expect(data.data.summary).toHaveProperty('tips')
    expect(data.data.summary).toHaveProperty('incentives')
    expect(data.data.summary).toHaveProperty('penalties')
    expect(data.data.summary).toHaveProperty('total')
    expect(data.data.summary).toHaveProperty('deliveries')

    // Earnings pagination
    expect(data.data.earnings).toHaveProperty('items')
    expect(data.data.earnings).toHaveProperty('total')
    expect(data.data.earnings).toHaveProperty('page')
    expect(data.data.earnings).toHaveProperty('limit')
    expect(data.data.earnings).toHaveProperty('totalPages')
    expect(data.data.earnings).toHaveProperty('hasMore')

    // Lifetime stats
    expect(data.data.lifetime).toHaveProperty('totalDeliveries')
    expect(data.data.lifetime).toHaveProperty('totalEarnings')
    expect(data.data.lifetime).toHaveProperty('rating')
  })

  test('GET /rider/earnings?period=today - should filter by today', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings?period=today`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.summary).toBeDefined()
  })

  test('GET /rider/earnings?period=week - should filter by week', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings?period=week`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.summary).toBeDefined()
  })

  test('GET /rider/earnings?period=month - should filter by month', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings?period=month`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.summary).toBeDefined()
  })

  test('GET /rider/earnings?period=all - should get all earnings', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings?period=all`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.summary).toBeDefined()
  })

  test('GET /rider/earnings?page=1&limit=10 - should paginate', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/earnings?page=1&limit=10`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.earnings.page).toBe(1)
    expect(data.data.earnings.limit).toBe(10)
  })

  test('GET /rider/earnings - should fail without auth', async () => {
    const { response } = await makeRequest(`${RIDER_BASE}/earnings`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })
})
