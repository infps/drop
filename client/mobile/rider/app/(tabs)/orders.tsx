import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Platform,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useOrders } from '../../hooks/use-orders';
import {
  formatCurrency,
  formatDistance,
  formatOrderStatus,
} from '../../utils/formatting';

// Toast notification component
const Toast = ({ message, type, visible, onHide }: {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
}) => {
  const translateY = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        type === 'success' ? styles.toastSuccess : styles.toastError,
        { transform: [{ translateY }] }
      ]}
    >
      <MaterialIcons
        name={type === 'success' ? 'check-circle' : 'error'}
        size={20}
        color="#fff"
      />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, isLoading, error, fetchAvailableOrders, acceptOrder } =
    useOrders();
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const [acceptedOrderIds, setAcceptedOrderIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  useFocusEffect(
    useCallback(() => {
      // Clear accepted orders on focus to reset state
      setAcceptedOrderIds(new Set());
      fetchAvailableOrders();
    }, [fetchAvailableOrders])
  );

  const handleAcceptOrder = async (orderId: string) => {
    // Prevent accepting the same order multiple times
    if (acceptedOrderIds.has(orderId)) {
      return;
    }

    try {
      setAcceptingOrderId(orderId);
      await acceptOrder(orderId);
      // Mark as accepted to prevent re-clicking
      setAcceptedOrderIds(prev => new Set(prev).add(orderId));
      showToast('Order accepted! Head to restaurant.', 'success');
      // Navigate to active deliveries after a short delay
      setTimeout(() => {
        router.push('/(tabs)/active');
      }, 1500);
    } catch (error: any) {
      showToast(error.message || 'Failed to accept order', 'error');
    } finally {
      setAcceptingOrderId(null);
    }
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.vendor?.name || 'Unknown'}</Text>
          <View style={styles.distanceRow}>
            <MaterialIcons name="location-on" size={14} color="#666" />
            <Text style={styles.distance}>
              {item.address?.fullAddress || 'Location pending'}
            </Text>
          </View>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.price}>{formatCurrency(item.deliveryFee)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Items</Text>
          <Text style={styles.detailValue}>{item.items?.length || 0}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(item.total || 0)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>
            {formatOrderStatus(item.status)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.acceptButton, (acceptingOrderId === item.id || acceptedOrderIds.has(item.id)) && styles.acceptButtonDisabled]}
        onPress={() => handleAcceptOrder(item.id)}
        disabled={acceptingOrderId !== null || acceptedOrderIds.has(item.id)}
      >
        {acceptingOrderId === item.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : acceptedOrderIds.has(item.id) ? (
          <Text style={styles.acceptButtonText}>Accepted</Text>
        ) : (
          <Text style={styles.acceptButtonText}>Accept Order</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchAvailableOrders()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Available Orders</Text>
        <Text style={styles.subtitle}>
          {orders?.length || 0} order{(orders?.length || 0) !== 1 ? 's' : ''} available
        </Text>
      </View>

      {isLoading && !(orders?.length) ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (orders?.length || 0) === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="inbox" size={64} color="#ccc" />
          </View>
          <Text style={styles.emptyTitle}>No Orders Available</Text>
          <Text style={styles.emptyText}>
            Check back soon for new delivery opportunities
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => fetchAvailableOrders()}
              tintColor="#FF6B6B"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vendorInfo: {
    flex: 1,
    marginRight: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  priceTag: {
    backgroundColor: '#FFE5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  acceptButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  acceptButtonDisabled: {
    opacity: 0.7,
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  toastSuccess: {
    backgroundColor: '#4CAF50',
  },
  toastError: {
    backgroundColor: '#F44336',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
