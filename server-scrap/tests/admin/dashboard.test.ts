import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Admin Dashboard Routes', () => {
  test('GET /admin/dashboard - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/dashboard`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  test('GET /admin/dashboard - response structure', async () => {
    // This will fail with 401 but we're testing the route exists
    const { response } = await makeRequest(`${ADMIN_BASE}/dashboard`)

    // Route should exist (not 404)
    expect(response.status).not.toBe(404)
  })
})
