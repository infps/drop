// Commission calculations
export function calculateCommission(amount: number, rate: number): number {
  return Math.round(amount * (rate / 100))
}

export function calculateVendorPayout(total: number, commissionRate: number): number {
  const commission = calculateCommission(total, commissionRate)
  return total - commission
}

// Rider earnings calculations
export const RIDER_BASE_FEE = 30 // per delivery
export const RIDER_PER_KM = 5
export const RIDER_PEAK_BONUS = 20

export function calculateRiderEarning(
  distance: number,
  tip: number = 0,
  isPeak: boolean = false
): number {
  let total = RIDER_BASE_FEE
  total += distance * RIDER_PER_KM
  total += tip
  if (isPeak) total += RIDER_PEAK_BONUS
  return total
}

// Delivery fee calculations
export const BASE_DELIVERY_FEE = 40
export const FREE_DELIVERY_ABOVE = 199
export const PER_KM_CHARGE = 5
export const MAX_DISTANCE_KM = 15

export function calculateDeliveryFee(
  orderTotal: number,
  distance: number,
  surgeMultiplier: number = 1
): number {
  if (orderTotal >= FREE_DELIVERY_ABOVE) return 0

  let fee = BASE_DELIVERY_FEE
  if (distance > 5) {
    fee += (distance - 5) * PER_KM_CHARGE
  }
  return Math.round(fee * surgeMultiplier)
}
