import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, ADMIN_BASE, setAuthToken, mockAdmin } from '../setup'

describe('Admin Auth Routes', () => {
  let testToken = ''

  test('POST /admin/auth/login - should succeed with valid credentials', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: mockAdmin.email,
        password: mockAdmin.password,
      }),
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.token).toBeDefined()
    expect(data.data.admin.email).toBe(mockAdmin.email)

    testToken = data.data.token
    setAuthToken(testToken)
  })

  test('POST /admin/auth/login - should fail with invalid credentials', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'wrong@test.com',
        password: 'wrong',
      }),
    })

    expect(response.status).toBe(401)
    expect(data.status).toBe('error')
  })

  test('POST /admin/auth/login - should fail without email', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        password: 'test',
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('POST /admin/auth/login - should fail without password', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@test.com',
      }),
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('GET /admin/auth/me - should succeed with valid token', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/me`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.data.email).toBe(mockAdmin.email)
  })

  test('GET /admin/auth/me - should fail without token', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/me`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  test('POST /admin/auth/logout - should succeed with valid token', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/auth/logout`, {
      method: 'POST',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
  })

  test('POST /admin/auth/logout - should fail without token', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/auth/logout`, {
      method: 'POST',
    })

    expect(response.status).toBe(401)
  })
})
