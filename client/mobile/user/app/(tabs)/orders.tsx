import { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { orderService } from '@/services/order.service'
import { Order } from '@/types/order.types'

export default function OrdersScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders({
        type: activeTab,
        page: 1,
        limit: 20,
      })
      if (response.success && response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    loadOrders()
  }, [activeTab])

  const onRefresh = () => {
    setRefreshing(true)
    loadOrders()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return '#34C759'
      case 'CANCELLED':
        return '#FF3B30'
      case 'OUT_FOR_DELIVERY':
        return '#FF6B6B'
      default:
        return '#FF9500'
    }
  }

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/orders/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderStatus}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]}
          />
          <Text style={styles.statusText}>{item.status.replace(/_/g, ' ')}</Text>
        </View>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.vendor && (
        <View style={styles.vendorInfo}>
          <MaterialIcons name="store" size={20} color="#8E8E93" />
          <Text style={styles.vendorName}>{item.vendor.name}</Text>
        </View>
      )}

      <Text style={styles.orderItems}>
        {item.items.length} item{item.items.length > 1 ? 's' : ''}
      </Text>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>₹{item.total.toFixed(2)}</Text>
        {activeTab === 'active' ? (
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.reorderButton}>
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}
            >
              Past Orders
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#fff',
  },
  loader: {
    marginTop: 32,
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  orderItems: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  trackButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
})
