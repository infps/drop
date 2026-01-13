import { describe, test, expect } from 'bun:test'
import { makeRequest } from './setup'

describe('Health & Server Tests', () => {
  test('GET / - should return health check', async () => {
    const { response, data } = await makeRequest('/')

    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.message).toBe('DROP API v2')
  })

  test('GET /unknown - should return 404', async () => {
    const { response } = await makeRequest('/unknown-route')
    expect(response.status).toBe(404)
  })
})
