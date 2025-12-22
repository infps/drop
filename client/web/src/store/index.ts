import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User,
  Address,
  CartItem,
  Product,
  Order,
  GenieOrder,
  Vendor,
  PartyEvent,
  Wallet,
  LoyaltyPoints,
  Subscription,
  Notification,
  SearchFilters,
  Location,
} from '@/types';

// ==================== AUTH STORE ====================
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'manager';
  isAuthenticated: boolean;
}

interface RiderUser {
  id: string;
  phone: string;
  name: string;
  isAuthenticated: boolean;
  isVerified: boolean;
  status: 'pending' | 'active' | 'suspended';
}

interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  riderUser: RiderUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  phone: string;
  setUser: (user: User | null) => void;
  setAdminUser: (admin: AdminUser | null) => void;
  setRiderUser: (rider: RiderUser | null) => void;
  setPhone: (phone: string) => void;
  setOtpSent: (sent: boolean) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  logoutAdmin: () => void;
  logoutRider: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      adminUser: null,
      riderUser: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      otpSent: false,
      phone: '',
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAdminUser: (adminUser) => set({ adminUser }),
      setRiderUser: (riderUser) => set({ riderUser }),
      setPhone: (phone) => set({ phone }),
      setOtpSent: (otpSent) => set({ otpSent }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, isAuthenticated: false, phone: '', otpSent: false, token: null }),
      logoutAdmin: () => set({ adminUser: null, token: null }),
      logoutRider: () => set({ riderUser: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
    }
  )
);

// ==================== LOCATION STORE ====================
interface LocationState {
  currentLocation: Location | null;
  selectedAddress: Address | null;
  addresses: Address[];
  isDetecting: boolean;
  setCurrentLocation: (location: Location | null) => void;
  setSelectedAddress: (address: Address | null) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setIsDetecting: (detecting: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: null,
      selectedAddress: null,
      addresses: [],
      isDetecting: false,
      setCurrentLocation: (currentLocation) => set({ currentLocation }),
      setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setIsDetecting: (isDetecting) => set({ isDetecting }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
    }
  )
);

// ==================== CART STORE ====================
interface CartState {
  items: CartItem[];
  selectedVendorId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedVendor: (vendorId: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedVendorId: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),
      updateItem: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [], selectedVendorId: null }),
      setSelectedVendor: (vendorId) => set({ selectedVendorId: vendorId }),
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.quantity * 100), 0); // Note: requires product price info
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
    }
  )
);

// ==================== ORDERS STORE ====================
interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

export const useOrdersStore = create<OrdersState>()((set) => ({
  orders: [],
  currentOrder: null,
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  setCurrentOrder: (currentOrder) => set({ currentOrder }),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),
}));

// ==================== UI STORE ====================
interface UIState {
  showBottomNav: boolean;
  showHeader: boolean;
  notificationsCount: number;
  setShowBottomNav: (show: boolean) => void;
  setShowHeader: (show: boolean) => void;
  setNotificationsCount: (count: number) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  showBottomNav: true,
  showHeader: true,
  notificationsCount: 0,
  setShowBottomNav: (showBottomNav) => set({ showBottomNav }),
  setShowHeader: (showHeader) => set({ showHeader }),
  setNotificationsCount: (notificationsCount) => set({ notificationsCount }),
}));
