import { db } from '@/db'
import { admins } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { comparePassword } from '@/helpers/auth.helper'

export async function validateAdmin(email: string, password: string) {
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1)

  if (!admin) {
    return null
  }

  if (!admin.isActive) {
    throw new Error('Admin account is inactive')
  }

  const isValid = await comparePassword(password, admin.password)
  if (!isValid) {
    return null
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }
}

export async function getAdminById(id: string) {
  const [admin] = await db
    .select({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      role: admins.role,
      isActive: admins.isActive,
      createdAt: admins.createdAt,
    })
    .from(admins)
    .where(eq(admins.id, id))
    .limit(1)

  return admin || null
}
