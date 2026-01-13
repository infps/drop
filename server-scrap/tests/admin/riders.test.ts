import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Admin Riders Routes', () => {
  test('GET /admin/riders - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/riders`)
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/riders/:id/approve - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/riders/123/approve`, {
      method: 'PATCH',
    })
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/riders/:id/suspend - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/riders/123/suspend`, {
      method: 'PATCH',
    })
    expect(response.status).toBe(401)
  })

  test('GET /admin/riders/earnings - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/riders/earnings?riderId=123`)
    expect(response.status).toBe(401)
  })
})
