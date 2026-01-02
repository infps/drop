import { describe, test, expect } from 'bun:test'
import { makeRequest, ADMIN_BASE } from '../setup'

describe('Finance Routes', () => {
  test('GET /admin/finance - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/finance`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/finance/vendor-payouts - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/finance/vendor-payouts`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/finance/rider-payouts - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/finance/rider-payouts`)
    expect(response.status).toBe(401)
  })
})

describe('Analytics Routes', () => {
  test('GET /admin/analytics/kpis - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/analytics/kpis`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/analytics/trends - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/analytics/trends`)
    expect(response.status).toBe(401)
  })
})

describe('Zones Routes', () => {
  test('GET /admin/zones - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/zones`)
    expect(response.status).toBe(401)
  })

  test('PATCH /admin/zones/surge - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/zones/surge`, {
      method: 'PATCH',
      body: JSON.stringify({ zoneId: '123', surgePricing: 1.5 }),
    })
    expect(response.status).toBe(401)
  })
})

describe('Marketing Routes', () => {
  test('GET /admin/marketing/campaigns - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/marketing/campaigns`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/marketing/coupons - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/marketing/coupons`)
    expect(response.status).toBe(401)
  })
})

describe('Fleet Routes', () => {
  test('GET /admin/fleet/vehicles - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/fleet/vehicles`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/fleet/live - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/fleet/live`)
    expect(response.status).toBe(401)
  })
})

describe('Inventory Routes', () => {
  test('GET /admin/inventory - should require vendorId', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/inventory`)
    // Will fail with auth first, but testing route exists
    expect([400, 401]).toContain(response.status)
  })
})

describe('Departments Routes', () => {
  test('GET /admin/departments/restaurants - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/departments/restaurants`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/departments/grocery - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/departments/grocery`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/departments/pharmacy - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/departments/pharmacy`)
    expect(response.status).toBe(401)
  })
})

describe('Settings Routes', () => {
  test('GET /admin/settings/general - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/settings/general`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/settings/payments - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/settings/payments`)
    expect(response.status).toBe(401)
  })
})

describe('AI Routes', () => {
  test('GET /admin/ai/assignment - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/ai/assignment`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/ai/fraud - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/ai/fraud`)
    expect(response.status).toBe(401)
  })
})

describe('Compliance Routes', () => {
  test('GET /admin/compliance/kyc - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/compliance/kyc`)
    expect(response.status).toBe(401)
  })

  test('GET /admin/compliance/audit - should require auth', async () => {
    const { response } = await makeRequest(`${ADMIN_BASE}/compliance/audit`)
    expect(response.status).toBe(401)
  })
})
