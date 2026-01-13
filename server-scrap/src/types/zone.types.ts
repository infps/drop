import type { FilterParams } from './api.types'

export interface ZoneFilters extends FilterParams {
  isActive?: boolean
}

export interface SurgePricing {
  zoneId: string
  surgePricing: number
  enabled: boolean
}
