export interface Vendor {
  id: string
  name: string
  description?: string
  logo?: string
  coverImage?: string
  type: string // category/type (food, grocery, pharmacy, etc)
  rating: number
  totalRatings: number
  address: string
  latitude: number
  longitude: number
  minimumOrder: number
  avgDeliveryTime: number // in minutes
  deliveryFee: number
  distance?: number // calculated distance from user
  isOpen?: boolean
  isActive: boolean
  openingTime: string
  closingTime: string
}

export interface Product {
  id: string
  vendorId: string
  name: string
  description?: string
  price: number
  images: string[]
  category?: {
    id: string
    name: string
    icon?: string
  }
  isVeg: boolean
  inStock: boolean
  rating?: number
  customizations?: ProductCustomization[]
}

export interface ProductCustomization {
  id: string
  name: string
  type: 'SINGLE' | 'MULTIPLE'
  required: boolean
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
}
