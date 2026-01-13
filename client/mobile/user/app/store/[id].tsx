import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { vendorService } from '@/services/vendor.service'
import { Vendor, Product } from '@/types/vendor.types'
import { useCartStore } from '@/store/cart-store'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const IMAGE_HEIGHT = 200

export default function StoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { items, addItem, updateQuantity, getTotal, getItemCount } = useCartStore()

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const cartItemCount = getItemCount()
  const cartTotal = getTotal()

  useEffect(() => {
    if (id) {
      loadStore()
    }
  }, [id])

  const loadStore = async () => {
    try {
      setIsLoading(true)
      const [vendorRes, productsRes] = await Promise.all([
        vendorService.getVendorById(id!),
        vendorService.getVendorMenu(id!),
      ])

      if (vendorRes.success && vendorRes.data) {
        setVendor(vendorRes.data)
      }
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data)
      }
    } catch (error) {
      console.error('Failed to load store:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProductQuantity = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    return item?.quantity || 0
  }

  const handleAdd = (product: Product) => {
    if (!vendor) return
    addItem(product)
  }

  const handleIncrement = (productId: string) => {
    const qty = getProductQuantity(productId)
    updateQuantity(productId, qty + 1)
  }

  const handleDecrement = (productId: string) => {
    const qty = getProductQuantity(productId)
    updateQuantity(productId, qty - 1)
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!vendor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: vendor.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={cartItemCount > 0 ? { paddingBottom: 80 } : undefined}
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {products.length === 0 ? (
            <View style={styles.emptyMenu}>
              <MaterialIcons name="restaurant-menu" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No items available</Text>
            </View>
          ) : (
            products.map((product) => (
              <MenuItemCard
                key={product.id}
                product={product}
                quantity={getProductQuantity(product.id)}
                onAdd={() => handleAdd(product)}
                onIncrement={() => handleIncrement(product.id)}
                onDecrement={() => handleDecrement(product.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Cart Bottom Bar */}
      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => router.push('/cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartBarText}>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
          <View style={styles.cartBarRight}>
            <Text style={styles.cartBarTotal}>₹{cartTotal}</Text>
            <Text style={styles.cartBarAction}>View Cart</Text>
            <MaterialIcons name="chevron-right" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

// Menu Item Card with Image Carousel
function MenuItemCard({
  product,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}: {
  product: Product
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onDecrement: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const images = product.images?.length > 0 ? product.images : []

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setActiveIndex(slideIndex)
  }

  return (
    <View style={styles.menuCard}>
      <View style={styles.menuCardInner}>
        {/* Image Carousel */}
        {images.length > 0 ? (
          <View>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.menuImage} />
              )}
            />
            {/* Pagination Dots */}
            {images.length > 1 && (
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeIndex && styles.paginationDotActive,
                    ]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.menuImage, styles.menuImagePlaceholder]}>
          <MaterialIcons name="fastfood" size={40} color="#ccc" />
        </View>
      )}

      {/* Item Info */}
      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <View style={[styles.vegIndicator, { borderColor: product.isVeg ? '#0f9d58' : '#db4437' }]}>
            <View
              style={[
                styles.vegDot,
                { backgroundColor: product.isVeg ? '#0f9d58' : '#db4437' },
              ]}
            />
          </View>
          <Text style={styles.menuItemName} numberOfLines={2}>
            {product.name}
          </Text>
        </View>

        {product.description && (
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>₹{product.price}</Text>

          {!product.inStock ? (
            <View style={[styles.addButton, styles.addButtonDisabled]}>
              <Text style={styles.addButtonText}>Out of stock</Text>
            </View>
          ) : quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.qtyButton} onPress={onDecrement}>
                <MaterialIcons name="remove" size={18} color="#FF6B6B" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={onIncrement}>
                <MaterialIcons name="add" size={18} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerBack: {
    marginLeft: 8,
    padding: 4,
  },
  menuSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  emptyMenu: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  menuCardInner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuImage: {
    width: SCREEN_WIDTH - 32,
    height: IMAGE_HEIGHT,
  },
  menuImagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  menuItemInfo: {
    padding: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#0f9d58',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    marginLeft: 24,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Quantity controls
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  qtyButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    minWidth: 24,
    textAlign: 'center',
  },
  // Cart bar
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 24,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cartBadgeText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '700',
  },
  cartBarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBarTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  cartBarAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
})
