import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, setAuthToken } from '../setup'
import { sign } from 'hono/jwt'
import { db } from '../../src/db'
import { riders } from '../../src/db/schema'
import { eq } from 'drizzle-orm'

const RIDER_BASE = '/rider'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long'

describe('Rider Location Routes', () => {
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

  test('POST /rider/location - should update location with auth', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/location`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        latitude: 12.9716,
        longitude: 77.5946,
        isOnline: true,
      }),
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.message).toBe('Location updated')
    expect(data.data.isOnline).toBe(true)
  })

  test('POST /rider/location - should fail without coordinates', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/location`, {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        isOnline: true,
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
    expect(data.message).toContain('coordinates')
  })

  test('POST /rider/location - should fail without auth', async () => {
    const { response } = await makeRequest(`${RIDER_BASE}/location`, {
      method: 'POST',
      body: JSON.stringify({
        latitude: 12.9716,
        longitude: 77.5946,
      }),
    })

    expect(response.status).toBe(401)
  })

  test('GET /rider/location - should get location status', async () => {
    const { response, data } = await makeRequest(`${RIDER_BASE}/location`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data).toHaveProperty('isOnline')
    expect(data.data).toHaveProperty('isAvailable')
    expect(data.data).toHaveProperty('activeOrdersCount')
  })

  test('GET /rider/location - should fail without auth', async () => {
    const { response } = await makeRequest(`${RIDER_BASE}/location`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })
})
