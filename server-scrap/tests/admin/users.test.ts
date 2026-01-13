import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Admin Users Routes', () => {
  test('GET /admin/users - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users`)
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/users/verify-kyc - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users/verify-kyc`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123', verified: true }),
    })
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/users/verify-age - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users/verify-age`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123', verified: true }),
    })
    expect(response.status).toBe(401)
  })
})
