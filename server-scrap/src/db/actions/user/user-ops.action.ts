import { db } from '@/db'
import { users } from '@/db/schema'
import { and, eq, like, count, desc } from 'drizzle-orm'
import { getPaginationParams } from '@/helpers/pagination.helper'
import type { UserFilters } from '@/types/user.types'

export async function listUsers(filters: UserFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []

  if (filters.status === 'verified') {
    conditions.push(eq(users.isKycVerified, true))
  } else if (filters.status === 'unverified') {
    conditions.push(eq(users.isKycVerified, false))
  }

  if (filters.isKycVerified !== undefined) {
    conditions.push(eq(users.isKycVerified, filters.isKycVerified))
  }

  if (filters.isAgeVerified !== undefined) {
    conditions.push(eq(users.isAgeVerified, filters.isAgeVerified))
  }

  if (filters.search) {
    // Search by name, email, or phone
    conditions.push(like(users.name, `%${filters.search}%`))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        isKycVerified: users.isKycVerified,
        isAgeVerified: users.isAgeVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(users)
      .where(where),
  ])

  return { data, total: Number(total) }
}

export async function verifyKYC(userId: string, verified: boolean) {
  const [user] = await db
    .update(users)
    .set({ isKycVerified: verified })
    .where(eq(users.id, userId))
    .returning()

  return user
}

export async function verifyAge(userId: string, verified: boolean) {
  const [user] = await db
    .update(users)
    .set({ isAgeVerified: verified })
    .where(eq(users.id, userId))
    .returning()

  return user
}
