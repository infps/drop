export interface VehicleData {
  riderId: string
  riderName: string
  vehicleType: string
  vehicleNumber: string
  deliveriesToday: number
  batteryLevel?: number
  range?: number
}

export interface LiveTracking {
  riderId: string
  riderName: string
  lat: number
  lng: number
  status: string
  currentOrder?: string
}
