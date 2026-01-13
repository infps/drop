import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { vendorService } from '@/services/vendor.service'
import { useLocationStore } from '@/store/location-store'
import { Vendor, Product } from '@/types/vendor.types'

const RECENT_SEARCHES_KEY = '@drop_recent_searches'
const MAX_RECENT = 8

interface SearchResults {
  vendors: Vendor[]
  products: (Product & { vendor: { id: string; name: string; logo?: string } })[]
}

export default function SearchScreen() {
  const router = useRouter()
  const { currentLocation } = useLocationStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) setRecentSearches(JSON.parse(saved))
    } catch (e) {
      console.error('Failed to load recent searches:', e)
    }
  }

  const saveRecentSearch = async (search: string) => {
    try {
      const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, MAX_RECENT)
      setRecentSearches(updated)
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save recent search:', e)
    }
  }

  const clearRecentSearches = async () => {
    setRecentSearches([])
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const performSearch = useCallback(
    async (searchText: string) => {
      if (searchText.length < 2) {
        setResults(null)
        return
      }

      setIsLoading(true)
      try {
        const response = await vendorService.searchVendorsAndProducts(
          searchText,
          currentLocation?.latitude,
          currentLocation?.longitude
        )
        if (response.success && response.data) {
          // Handle nested API response structure
          const data = response.data as any
          setResults({
            vendors: data.vendors?.data || [],
            products: data.products?.data || [],
          })
          saveRecentSearch(searchText)
        }
      } catch (error) {
        console.error('Search failed:', error)
        setResults({ vendors: [], products: [] })
      } finally {
        setIsLoading(false)
      }
    },
    [currentLocation]
  )

  const handleSearch = (text: string) => {
    setQuery(text)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (text.length < 2) {
      setResults(null)
      return
    }
    debounceRef.current = setTimeout(() => performSearch(text), 300)
  }

  const handleRecentTap = (search: string) => {
    setQuery(search)
    performSearch(search)
  }

  const hasResults = results && (results.vendors.length > 0 || results.products.length > 0)
  const noResults = results && results.vendors.length === 0 && results.products.length === 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes..."
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => performSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
        ) : hasResults ? (
          <>
            {results.vendors.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Restaurants</Text>
                {results.vendors.map((vendor) => (
                  <TouchableOpacity
                    key={vendor.id}
                    style={styles.vendorCard}
                    onPress={() => router.push(`/store/${vendor.id}`)}
                  >
                    {vendor.logo ? (
                      <Image source={{ uri: vendor.logo }} style={styles.vendorLogo} />
                    ) : (
                      <View style={[styles.vendorLogo, styles.vendorLogoPlaceholder]}>
                        <MaterialIcons name="store" size={24} color="#ccc" />
                      </View>
                    )}
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{vendor.name}</Text>
                      <View style={styles.vendorMeta}>
                        {vendor.rating > 0 && (
                          <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={12} color="#fff" />
                            <Text style={styles.ratingText}>{vendor.rating.toFixed(1)}</Text>
                          </View>
                        )}
                        {vendor.distance !== undefined && vendor.distance !== null && (
                          <Text style={styles.distanceText}>{vendor.distance} km</Text>
                        )}
                        {vendor.avgDeliveryTime > 0 && (
                          <Text style={styles.deliveryTime}>{vendor.avgDeliveryTime} min</Text>
                        )}
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {results.products.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Products</Text>
                {results.products.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => router.push(`/store/${product.vendor?.id || product.vendorId}`)}
                  >
                    {product.images?.[0] ? (
                      <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                    ) : (
                      <View style={[styles.productImage, styles.productImagePlaceholder]}>
                        <MaterialIcons name="fastfood" size={24} color="#ccc" />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                      {product.vendor?.name && (
                        <Text style={styles.productVendor} numberOfLines={1}>
                          {product.vendor.name}
                        </Text>
                      )}
                      <Text style={styles.productPrice}>₹{product.price}</Text>
                    </View>
                    <View style={styles.vegIndicator}>
                      <View style={[styles.vegDot, { backgroundColor: product.isVeg ? '#0f9d58' : '#db4437' }]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : noResults ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No results for "{query}"</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            {recentSearches.length > 0 ? (
              <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.recentItem}
                    onPress={() => handleRecentTap(search)}
                  >
                    <MaterialIcons name="history" size={20} color="#8E8E93" />
                    <Text style={styles.recentText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                <MaterialIcons name="search" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Search for restaurants and dishes</Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  // Vendor card styles
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vendorLogo: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  vendorLogoPlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f9d58',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
  },
  // Product card styles
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  productVendor: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 4,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#0f9d58',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Recent searches
  recentSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  clearText: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
})
