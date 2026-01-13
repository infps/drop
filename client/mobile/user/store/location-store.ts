import { create } from 'zustand'
import { Address } from '../types/user.types'

interface LocationState {
  currentLocation: {
    latitude: number
    longitude: number
    address?: string
  } | null
  selectedAddress: Address | null

  // Actions
  setCurrentLocation: (lat: number, lng: number, address?: string) => void
  setSelectedAddress: (address: Address | null) => void
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  selectedAddress: null,

  setCurrentLocation: (latitude, longitude, address) => {
    set({ currentLocation: { latitude, longitude, address } })
  },

  setSelectedAddress: (address) => {
    set({ selectedAddress: address })
  },
}))
