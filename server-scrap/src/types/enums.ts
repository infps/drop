// Re-export enums from schema
export type {
  AdminRole,
  OrderStatus,
  OrderType,
  PaymentStatus,
  PaymentType,
  TransactionType,
  VendorType,
  VehicleType,
  TableStatus,
  ReservationStatus,
  DineInOrderStatus,
  ShiftStatus,
} from '@/db/schemas/enums'

// Additional admin-specific enums
export const AdminRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  OPERATIONS: 'OPERATIONS',
  FINANCE: 'FINANCE',
  MARKETING: 'MARKETING',
  SUPPORT: 'SUPPORT',
} as const

export const AuditActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  SUSPEND: 'SUSPEND',
  ACTIVATE: 'ACTIVATE',
} as const
