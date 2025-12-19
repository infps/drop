export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  product?: {
    id: string;
    name: string;
    image?: string;
    price: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  riderId?: string;
  addressId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Items
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  deliveryFee: number;
  platformFee?: number;
  discount?: number;
  total: number;

  // Location
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;

  // Estimated times
  estimatedPickupTime?: number; // in minutes
  estimatedDeliveryTime?: number; // in minutes

  // Relations
  user?: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
  };
  vendor?: {
    id: string;
    name: string;
    logo?: string;
    address: string;
    phone?: string;
  };
  rider?: {
    id: string;
    name: string;
    phone: string;
    vehicleNumber?: string;
  };
  address?: {
    id: string;
    fullAddress: string;
    landmark?: string;
    latitude: number;
    longitude: number;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  limit: number;
  total: number;
}

export interface OrderActionRequest {
  orderId: string;
  action: 'accept' | 'pickup' | 'deliver';
}

export interface OrderActionResponse {
  success: boolean;
  message: string;
  order?: Order;
}
