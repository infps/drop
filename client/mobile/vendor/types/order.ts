export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'ONLINE' | 'WALLET';
export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  notes?: string;
  customizations?: Record<string, any>;
}

export interface OrderAddress {
  id: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface OrderUser {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface OrderRider {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleNumber?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  user: OrderUser;
  rider?: OrderRider;
  items: OrderItem[];
  address?: OrderAddress;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  statusHistory: OrderStatusHistory[];
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}
