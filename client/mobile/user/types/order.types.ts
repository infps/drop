export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type PaymentMethod = 'RAZORPAY' | 'COD' | 'WALLET'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  vendorId: string
  riderId?: string
  status: OrderStatus
  total: number
  subtotal: number
  deliveryFee: number
  discount: number
  tip: number
  paymentMethod: PaymentMethod
  paymentStatus: string
  deliveryAddress: string
  deliveryInstructions?: string
  items: OrderItem[]
  vendor?: {
    id: string
    name: string
    logo: string
  }
  rider?: {
    id: string
    name: string
    phone: string
    rating: number
  }
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  quantity: number
  price: number
  customizations?: Record<string, any>
  notes?: string
}

export interface CartItem {
  productId: string
  product: {
    id: string
    name: string
    price: number
    image?: string
    isVeg: boolean
  }
  quantity: number
  customizations?: Record<string, any>
  notes?: string
}
