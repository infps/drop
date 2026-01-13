import type { FilterParams } from './api.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface AdminPayload {
  id: string
  role: string
}

export interface Admin {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: Date
}

export interface AuditLogCreate {
  adminId: string
  action: string
  entity: string
  entityId?: string
  details?: any
}

export interface AuditLog {
  id: string
  adminId: string
  action: string
  entity: string
  entityId: string | null
  details: any
  createdAt: Date
}

export interface AuditLogFilters extends FilterParams {
  adminId?: string
  action?: string
  entity?: string
  from?: Date
  to?: Date
}
