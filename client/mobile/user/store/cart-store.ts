import { create } from 'zustand'
import { CartItem } from '../types/order.types'
import { Product } from '../types/vendor.types'

interface CartState {
  items: CartItem[]
  vendorId: string | null
  vendorName: string | null

  // Actions
  addItem: (product: Product, quantity?: number, customizations?: any, notes?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  canAddItem: (vendorId: string) => boolean
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  vendorId: null,
  vendorName: null,

  addItem: (product, quantity = 1, customizations, notes) => {
    const state = get()

    // Check if item already exists
    const existingItemIndex = state.items.findIndex(
      (item) => item.productId === product.id
    )

    if (existingItemIndex > -1) {
      // Update quantity
      const updatedItems = [...state.items]
      updatedItems[existingItemIndex].quantity += quantity
      set({ items: updatedItems })
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          isVeg: product.isVeg,
        },
        quantity,
        customizations,
        notes,
      }
      set({
        items: [...state.items, newItem],
        vendorId: product.vendorId,
      })
    }
  },

  removeItem: (productId) => {
    const state = get()
    const updatedItems = state.items.filter((item) => item.productId !== productId)
    set({
      items: updatedItems,
      vendorId: updatedItems.length === 0 ? null : state.vendorId,
      vendorName: updatedItems.length === 0 ? null : state.vendorName,
    })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    const state = get()
    const updatedItems = state.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    )
    set({ items: updatedItems })
  },

  clearCart: () => {
    set({ items: [], vendorId: null, vendorName: null })
  },

  getTotal: () => {
    const state = get()
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  },

  getItemCount: () => {
    const state = get()
    return state.items.reduce((count, item) => count + item.quantity, 0)
  },

  canAddItem: (vendorId) => {
    const state = get()
    return state.vendorId === null || state.vendorId === vendorId
  },
}))
