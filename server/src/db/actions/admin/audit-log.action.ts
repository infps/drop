import { db } from '@/db'
import { auditLogs } from '@/db/schema'
import { and, eq, gte, lte, desc, count } from 'drizzle-orm'
import type { AuditLogCreate, AuditLogFilters } from '@/types/admin.types'
import { getPaginationParams } from '@/helpers/pagination.helper'

export async function createAuditLog(data: AuditLogCreate) {
  const [log] = await db
    .insert(auditLogs)
    .values({
      adminId: data.adminId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId || null,
      details: data.details || {},
    })
    .returning()

  return log
}

export async function listAuditLogs(filters: AuditLogFilters) {
  const { page, limit, offset } = getPaginationParams(filters)

  const conditions = []
  if (filters.adminId) conditions.push(eq(auditLogs.adminId, filters.adminId))
  if (filters.action) conditions.push(eq(auditLogs.action, filters.action))
  if (filters.entity) conditions.push(eq(auditLogs.entity, filters.entity))
  if (filters.from) conditions.push(gte(auditLogs.createdAt, filters.from))
  if (filters.to) conditions.push(lte(auditLogs.createdAt, filters.to))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [data, [{ total }]] = await Promise.all([
    db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(auditLogs)
      .where(where),
  ])

  return { data, total: Number(total) }
}
