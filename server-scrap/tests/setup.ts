// Test setup - expects server running manually
export const API_URL = process.env.API_URL || 'http://localhost:3000'
export const ADMIN_BASE = '/admin'

// Mock admin user
export const mockAdmin = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'admin@test.com',
  password: 'Test123!',
  role: 'SUPER_ADMIN',
}

// Mock JWT token (for testing - not real)
export let authToken = ''

// Helper to make authenticated requests
export async function makeRequest(
  path: string,
  options?: RequestInit & { auth?: boolean }
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  }

  if (options?.auth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }
  return { response, data }
}

// Set auth token for tests
export function setAuthToken(token: string) {
  authToken = token
}
