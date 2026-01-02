import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, ADMIN_BASE, setAuthToken, mockAdmin } from '../setup'

describe('Admin Vendors CRUD', () => {
  let authToken = ''
  let createdVendorId = ''

  // Auth before all tests
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

  // CREATE
  test('POST /admin/vendors - should create vendor', async () => {
    const vendorData = {
      name: 'Test Restaurant',
      description: 'A test restaurant',
      type: 'RESTAURANT',
      email: `test-vendor-${Date.now()}@test.com`,
      phone: `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      password: 'VendorPass123!',
      address: '123 Test St, Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      openingTime: '09:00',
      closingTime: '22:00',
      minimumOrder: 1000,
      commissionRate: 15,
    }

    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'POST',
      body: JSON.stringify(vendorData),
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.name).toBe(vendorData.name)
    expect(data.data.email).toBe(vendorData.email)
    expect(data.data.id).toBeDefined()

    createdVendorId = data.data.id
  })

  test('POST /admin/vendors - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    })

    expect(response.status).toBe(401)
  })

  test('POST /admin/vendors - should fail with missing required fields', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Incomplete' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  // READ
  test('GET /admin/vendors - should list vendors', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.pagination).toBeDefined()
  })

  test('GET /admin/vendors - should list with pagination', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors?page=1&limit=5`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(5)
  })

  test('GET /admin/vendors - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  test('GET /admin/vendors/:id - should get vendor by id', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors/${createdVendorId}`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.id).toBe(createdVendorId)
    expect(data.data.name).toBe('Test Restaurant')
  })

  test('GET /admin/vendors/:id - should fail with invalid id', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/00000000-0000-0000-0000-000000000000`,
      {
        method: 'GET',
        auth: true,
      }
    )

    expect(response.status).toBe(404)
    expect(data.status).toBe('error')
  })

  // UPDATE
  test('PUT /admin/vendors/:id - should update vendor', async () => {
    const updateData = {
      name: 'Updated Restaurant',
      description: 'Updated description',
      minimumOrder: 2000,
    }

    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors/${createdVendorId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.name).toBe(updateData.name)
    expect(data.data.minimumOrder).toBe(updateData.minimumOrder)
  })

  test('PUT /admin/vendors/:id - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors/${createdVendorId}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test' }),
    })

    expect(response.status).toBe(401)
  })

  test('PUT /admin/vendors/:id - should fail with invalid id', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Test' }),
        auth: true,
      }
    )

    expect(response.status).toBe(404)
    expect(data.status).toBe('error')
  })

  // STATUS ACTIONS
  test('PATCH /admin/vendors/:id/approve - should approve vendor', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/${createdVendorId}/approve`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toContain('approved')
  })

  test('PATCH /admin/vendors/:id/reject - should reject vendor', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/${createdVendorId}/reject`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toContain('rejected')
  })

  test('PATCH /admin/vendors/:id/suspend - should suspend vendor', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/${createdVendorId}/suspend`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toContain('suspended')
  })

  test('PATCH /admin/vendors/:id/activate - should activate vendor', async () => {
    const { response, data } = await makeRequest(
      `${ADMIN_BASE}/vendors/${createdVendorId}/activate`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toContain('activated')
  })

  // DELETE
  test('DELETE /admin/vendors/:id - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/vendors/${createdVendorId}`, {
      method: 'DELETE',
    })

    expect(response.status).toBe(401)
  })

  test('DELETE /admin/vendors/:id - should delete vendor', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/vendors/${createdVendorId}`, {
      method: 'DELETE',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toContain('deleted')
  })

  test('DELETE /admin/vendors/:id - should fail with invalid id', async () => {
    const { response } = await makeRequest(
      `${ADMIN_BASE}/vendors/00000000-0000-0000-0000-000000000000`,
      {
        method: 'DELETE',
        auth: true,
      }
    )

    // Should return 404 or 200 depending on implementation
    expect([200, 404]).toContain(response.status)
  })
})
