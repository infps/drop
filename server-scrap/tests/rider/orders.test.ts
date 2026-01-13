import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, setAuthToken } from '../setup'
import { sign } from 'hono/jwt'
import { db } from '../../src/db'
import { riders } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

const RIDER_BASE = '/rider'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long'

describe('Rider Orders Routes', () => {
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

  test('GET /rider/orders - should get all rider orders', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data).toHaveProperty('items')
    expect(data.data).toHaveProperty('total')
    expect(data.data).toHaveProperty('page')
    expect(data.data).toHaveProperty('limit')
    expect(data.data).toHaveProperty('totalPages')
    expect(data.data).toHaveProperty('hasMore')
  })

  test('GET /rider/orders?type=available - should get available orders', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders?type=available`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data.items)).toBe(true)
  })

  test('GET /rider/orders?type=active - should get active orders', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders?type=active`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data.items)).toBe(true)
  })

  test('GET /rider/orders?type=completed - should get completed orders', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders?type=completed`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data.items)).toBe(true)
  })

  test('GET /rider/orders?page=1&limit=5 - should paginate', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders?page=1&limit=5`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.page).toBe(1)
    expect(data.data.limit).toBe(5)
  })

  test('GET /rider/orders - should fail without auth', async () => {
    const { response } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  test('POST /rider/orders - should fail without orderId', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        action: 'accept',
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
    expect(data.message).toContain('Order ID')
  })

  test('POST /rider/orders - should fail without action', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        orderId: '123e4567-e89b-12d3-a456-426614174000',
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
    expect(data.message).toContain('action')
  })

  test('POST /rider/orders - should fail with invalid action', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'invalid',
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
    expect(data.message).toContain('Invalid action')
  })

  test('POST /rider/orders - should fail with non-existent order', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        orderId: '00000000-0000-0000-0000-000000000000',
        action: 'accept',
      }),
    })

    expect(response.status).toBe(404)
    expect(data.status).toBe('error')
    expect(data.message).toContain('not found')
  })

  test('POST /rider/orders - should fail without auth', async () => {
    const { response } = await makeRequest(`${RIDER_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        action: 'accept',
      }),
    })

    expect(response.status).toBe(401)
  })

  // Note: Full accept/pickup/deliver flow tests would require seeding specific order data
  // Those should be tested after running seed-riders.ts
})
