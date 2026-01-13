import { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { vendorService } from '@/services/vendor.service'
import { Vendor } from '@/types/vendor.types'
import { useLocationStore } from '@/store/location-store'

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'restaurant' },
  { id: 'grocery', name: 'Grocery', icon: 'shopping-cart' },
  { id: 'pharmacy', name: 'Pharmacy', icon: 'local-pharmacy' },
  { id: 'wine', name: 'Wine', icon: 'wine-bar' },
]

export default function HomeScreen() {
  const router = useRouter()
  const { currentLocation } = useLocationStore()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadVendors = async () => {
    try {
      const response = await vendorService.getVendors({
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        page: 1,
        limit: 20,
      })
      if (response.success && response.data) {
        setVendors(response.data)
      }
    } catch (error) {
      console.error('Failed to load vendors:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [currentLocation])

  const onRefresh = () => {
    setRefreshing(true)
    loadVendors()
  }

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => router.push(`/store/${item.id}`)}
    >
      {item.coverImage ? (
        <Image source={{ uri: item.coverImage }} style={styles.vendorImage} />
      ) : (
        <View style={[styles.vendorImage, styles.vendorImagePlaceholder]}>
          <MaterialIcons name="store" size={40} color="#ccc" />
        </View>
      )}
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.vendorMeta}>
          <MaterialIcons name="star" size={14} color="#FFB800" />
          <Text style={styles.vendorRating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.vendorDot}>•</Text>
          <Text style={styles.vendorTime}>{item.avgDeliveryTime} mins</Text>
        </View>
        {item.distance && (
          <Text style={styles.vendorDistance}>{item.distance.toFixed(1)} km away</Text>
        )}
        <Text style={styles.vendorDelivery}>₹{item.deliveryFee} delivery</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationButton}>
          <MaterialIcons name="location-on" size={20} color="#FF6B6B" />
          <Text style={styles.locationText} numberOfLines={1}>
            {currentLocation?.address || 'Select location'}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
        >
          <MaterialIcons name="search" size={20} color="#8E8E93" />
          <Text style={styles.searchPlaceholder}>Search restaurants, dishes...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <MaterialIcons name={category.icon as any} size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vendors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
          ) : (
            <FlatList
              data={vendors}
              renderItem={renderVendorCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.vendorList}
            />
          )}
        </View>
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    margin: 16,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
  categories: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#000',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  loader: {
    marginTop: 32,
  },
  vendorList: {
    paddingBottom: 16,
  },
  vendorCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  vendorImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  vendorImagePlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorRating: {
    fontSize: 14,
    marginLeft: 4,
    color: '#000',
  },
  vendorDot: {
    marginHorizontal: 6,
    color: '#8E8E93',
  },
  vendorTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  vendorDistance: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  vendorDelivery: {
    fontSize: 12,
    color: '#8E8E93',
  },
})
