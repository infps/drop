export interface AssignmentConfig {
  enabled: boolean
  maxDistance: number
  maxWaitTime: number
  prioritizeRating: boolean
  prioritizeProximity: boolean
}

export interface FraudAlert {
  id: string
  type: string
  severity: string
  description: string
  createdAt: Date
}
