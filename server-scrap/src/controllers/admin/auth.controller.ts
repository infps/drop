import type { Context } from 'hono'
import { validateAdmin, getAdminById } from '@/db/actions/admin/auth.action'
import { generateToken } from '@/helpers/auth.helper'
import type { AdminPayload } from '@/types/admin.types'

export async function login(c: Context<any>) {
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.sendError('Email and password required', 400)
  }

  const admin = await validateAdmin(email, password)
  if (!admin) {
    return c.sendError('Invalid credentials', 401)
  }

  const token = await generateToken({ id: admin.id, role: admin.role })

  return c.success(
    {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    },
    'Login successful'
  )
}

export async function me(c: Context<any>) {
  const payload = c.get('jwtPayload') as AdminPayload
  const admin = await getAdminById(payload.id)

  if (!admin) {
    return c.sendError('Admin not found', 404)
  }

  return c.success(admin)
}

export async function logout(c: Context<any>) {
  // JWT logout is client-side (remove token)
  return c.success(null, 'Logged out successfully')
}
