import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Admin Vendors Routes', () => {
  test('GET /admin/vendors - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/vendors with pagination params - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors?page=1&limit=20`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/vendors/:id - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors/123`)
    expect(response.status).toBe(401)
  })

  test('POST /admin/vendors - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Vendor' }),
    })
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/vendors/:id/approve - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors/123/approve`, {
      method: 'PATCH',
    })
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/vendors/:id/suspend - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors/123/suspend`, {
      method: 'PATCH',
    })
    expect(response.status).toBe(401)
  })
})
