export interface Campaign {
  id: string
  title: string
  type: string
  status: string
  reach: number
  openRate: number
}

export interface Coupon {
  code: string
  title: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxDiscount?: number
  usageLimit: number
  validFrom: Date
  validTo: Date
}
