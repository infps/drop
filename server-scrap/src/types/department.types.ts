import type { VendorFilters } from './vendor.types'

export interface DepartmentFilters extends VendorFilters {
  // Department-specific filters extend vendor filters
}
