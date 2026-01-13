import { describe, test, expect, beforeAll } from 'bun:test'
import { makeRequest, ADMIN_BASE, setAuthToken, mockAdmin } from '../setup'

describe('Admin Users CRUD', () => {
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
  test('GET /admin/users - should list users', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.pagination).toBeDefined()
  })

  test('GET /admin/users - should list with pagination', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users?page=1&limit=5`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(5)
  })

  test('GET /admin/users - should filter by status', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users?status=active`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
  })

  test('GET /admin/users - should search users', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users?search=test`, {
      method: 'GET',
      auth: true,
    })

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
  })

  test('GET /admin/users - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users`, {
      method: 'GET',
    })

    expect(response.status).toBe(401)
  })

  // KYC VERIFICATION
  test('PATCH /admin/users/verify-kyc - should fail without userId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users/verify-kyc`, {
      method: 'PATCH',
      body: JSON.stringify({ verified: true }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/users/verify-kyc - should fail without verified field', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users/verify-kyc`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/users/verify-kyc - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users/verify-kyc`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123', verified: true }),
    })

    expect(response.status).toBe(401)
  })

  // AGE VERIFICATION
  test('PATCH /admin/users/verify-age - should fail without userId', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users/verify-age`, {
      method: 'PATCH',
      body: JSON.stringify({ verified: true }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/users/verify-age - should fail without verified field', async () => {
    const { response, data } = await makeRequest(`${ADMIN_BASE}/users/verify-age`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123' }),
      auth: true,
    })

    expect(response.status).toBe(400)
    expect(data.status).toBe('error')
  })

  test('PATCH /admin/users/verify-age - should fail without auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/users/verify-age`, {
      method: 'PATCH',
      body: JSON.stringify({ userId: '123', verified: true }),
    })

    expect(response.status).toBe(401)
  })
})
