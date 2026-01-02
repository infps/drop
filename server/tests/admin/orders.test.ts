import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Admin Orders Routes', () => {
  test('GET /admin/orders - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/orders/:id - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/123`)
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/orders/status - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderId: '123', status: 'CONFIRMED' }),
    })
    expect(response.status).toBe(401)
  })

  test('POST /admin/orders/assign-rider - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123', riderId: '456' }),
    })
    expect(response.status).toBe(401)
  })

  test('POST /admin/orders/cancel - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/cancel`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123', reason: 'Test' }),
    })
    expect(response.status).toBe(401)
  })
})
