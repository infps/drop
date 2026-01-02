import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, ADMIN_BASE, setAuthToken, mockAdmin } from '../setup'

describe('Admin Orders CRUD', () => {
  let authToken = ''

  beforeAll(async () => {
    const { data } = await makeRequest(`${ADMIN_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: mockAdmin.email,
        password: mockAdmin.password,
      }),
    })
    authToken = data.data.token
    setAuthToken(authToken)
  })

  // READ/LIST
  test('GET /admin/orders - should list orders', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.pagination).toBeDefined()
  })

  test('GET /admin/orders - should list with pagination', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders?page=1&limit=10`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(10)
  })

  test('GET /admin/orders - should filter by status', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders?status=PENDING`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
  })

  test('GET /admin/orders - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  test('GET /admin/orders/:id - should fail with invalid id', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/orders/00000000-0000-0000-0000-000000000000`,
      {
        method: 'GET',
        auth: true,
      }
    )

    expect(response.status).toBe(404)
    expect(data.status).toBe('error')
  })

  // UPDATE STATUS
  test('PATCH /admin/orders/status - should fail without orderId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'CONFIRMED' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/orders/status - should fail without status', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/orders/status - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderId: '123', status: 'CONFIRMED' }),
    })

    expect(response.status).toBe(401)
  })

  // ASSIGN RIDER
  test('POST /admin/orders/assign-rider - should fail without orderId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ riderId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('POST /admin/orders/assign-rider - should fail without riderId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('POST /admin/orders/assign-rider - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123', riderId: '456' }),
    })

    expect(response.status).toBe(401)
  })

  // CANCEL ORDER
  test('POST /admin/orders/cancel - should fail without orderId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Test' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('POST /admin/orders/cancel - should fail without reason', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/orders/cancel`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('POST /admin/orders/cancel - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/orders/cancel`, {
      method: 'POST',
      body: JSON.stringify({ orderId: '123', reason: 'Test' }),
    })

    expect(response.status).toBe(401)
  })
})
