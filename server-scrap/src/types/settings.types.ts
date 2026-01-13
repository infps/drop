export interface PlatformSettings {
  general?: {
    platformName: string
    supportEmail: string
    currency: string
    timezone: string
  }
  delivery?: {
    baseFee: number
    freeDeliveryAbove: number
    perKmCharge: number
    maxDistance: number
  }
  payments?: {
    enabledMethods: string[]
    cod: { enabled: boolean; maxAmount: number }
  }
}
