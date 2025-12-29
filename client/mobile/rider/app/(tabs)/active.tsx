import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Platform,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useOrders } from '../../hooks/use-orders';
import { formatCurrency, formatOrderStatus } from '../../utils/formatting';
import { Order } from '../../types';

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
        Animated.delay(2500),
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

type FilterType = 'active' | 'delivered';

export default function ActiveScreen() {
  const { orders, isLoading, fetchActiveOrders, fetchCompletedOrders, confirmPickup, startDelivery, completeDelivery } = useOrders();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
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

  const fetchOrders = useCallback(() => {
    if (activeFilter === 'active') {
      fetchActiveOrders();
    } else {
      fetchCompletedOrders();
    }
  }, [activeFilter, fetchActiveOrders, fetchCompletedOrders]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handlePickupOrder = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await confirmPickup(orderId);
      showToast('Order picked up! Head to customer now.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to confirm pickup', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await startDelivery(orderId);
      showToast('On your way! Deliver to customer.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to start delivery', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCompleteDelivery = async (orderId: string, paymentMethod: string) => {
    // Only show confirmation for COD orders
    if (paymentMethod === 'COD') {
      Alert.alert(
        'Collect Payment',
        `Have you collected ₹${orders?.find(o => o.id === orderId)?.total?.toFixed(2) || '0.00'} from the customer?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Collected',
            onPress: () => performCompleteDelivery(orderId),
          },
        ]
      );
    } else {
      performCompleteDelivery(orderId);
    }
  };

  const performCompleteDelivery = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await completeDelivery(orderId);
      showToast('Delivery completed! Great job! 🎉', 'success');
      // Refresh the active orders list
      fetchActiveOrders();
    } catch (error: any) {
      showToast(error.message || 'Failed to complete delivery', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCall = (phone: string | undefined) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleOpenMaps = (latitude: number | undefined, longitude: number | undefined, address: string) => {
    if (latitude && longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${address}@${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${address})`,
      });
      if (url) Linking.openURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return '#2196F3';
      case 'PICKED_UP':
        return '#FF9800';
      case 'OUT_FOR_DELIVERY':
        return '#4CAF50';
      case 'DELIVERED':
        return '#4CAF50';
      default:
        return '#FF6B6B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'assignment';
      case 'PICKED_UP':
        return 'inventory';
      case 'OUT_FOR_DELIVERY':
        return 'directions-bike';
      case 'DELIVERED':
        return 'check-circle';
      default:
        return 'local-shipping';
    }
  };

  const getActionButton = (item: Order, isUpdating: boolean) => {
    switch (item.status) {
      case 'ASSIGNED':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.pickupButton]}
            onPress={() => handlePickupOrder(item.id)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="store" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Pickup Order</Text>
              </>
            )}
          </TouchableOpacity>
        );
      case 'PICKED_UP':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleStartDelivery(item.id)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="directions-bike" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Start Delivery</Text>
              </>
            )}
          </TouchableOpacity>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleCompleteDelivery(item.id, item.paymentMethod)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Complete Delivery</Text>
              </>
            )}
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderDeliveryCard = ({ item }: { item: Order }) => {
    const isUpdating = updatingOrderId === item.id;
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.deliveryCard}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <MaterialIcons name={getStatusIcon(item.status) as any} size={16} color="#fff" />
          <Text style={styles.statusBadgeText}>{formatOrderStatus(item.status)}</Text>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{item.orderNumber?.slice(-8)}</Text>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>
              {item.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid'}
            </Text>
          </View>
        </View>

        {/* Pickup Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="store" size={18} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Pickup</Text>
          </View>
          <Text style={styles.placeName}>{item.vendor?.name || 'Restaurant'}</Text>
          <Text style={styles.address}>{item.vendor?.address || 'Address not available'}</Text>
        </View>

        {/* Delivery Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="location-on" size={18} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Deliver to</Text>
          </View>
          <Text style={styles.placeName}>{item.user?.name || 'Customer'}</Text>
          <Text style={styles.address}>{item.address?.fullAddress || 'Address not available'}</Text>
          {item.address?.landmark && (
            <Text style={styles.landmark}>Landmark: {item.address.landmark}</Text>
          )}
        </View>

        {/* Order Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Items</Text>
            <Text style={styles.detailValue}>{item.items?.length || 0}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.total)}</Text>
          </View>
          {item.paymentMethod === 'COD' && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Collect</Text>
              <Text style={[styles.detailValue, styles.collectAmount]}>
                {formatCurrency(item.total)}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons - only show for active orders */}
        {item.status !== 'DELIVERED' ? (
          <View style={styles.actionRow}>
            {/* Call Customer */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleCall(item.user?.phone)}
            >
              <MaterialIcons name="phone" size={20} color="#4CAF50" />
            </TouchableOpacity>

            {/* Navigate - to vendor for ASSIGNED, to customer for others */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleOpenMaps(
                item.status === 'ASSIGNED' ? item.vendor?.latitude : item.address?.latitude,
                item.status === 'ASSIGNED' ? item.vendor?.longitude : item.address?.longitude,
                item.status === 'ASSIGNED' ? (item.vendor?.address || '') : (item.address?.fullAddress || '')
              )}
            >
              <MaterialIcons name="navigation" size={20} color="#2196F3" />
            </TouchableOpacity>

            {/* Main Action Button */}
            {getActionButton(item, isUpdating)}
          </View>
        ) : (
          <View style={styles.deliveredInfo}>
            <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.deliveredText}>
              Delivered {item.deliveredAt ? new Date(item.deliveredAt).toLocaleDateString() : ''}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading && !(orders?.length)) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
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
        <Text style={styles.title}>Deliveries</Text>
        <Text style={styles.subtitle}>
          {orders?.length || 0} {activeFilter === 'active' ? 'active' : 'completed'} order{(orders?.length || 0) !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'active' && styles.filterChipActive]}
          onPress={() => handleFilterChange('active')}
        >
          <MaterialIcons
            name="local-shipping"
            size={16}
            color={activeFilter === 'active' ? '#fff' : '#666'}
          />
          <Text style={[styles.filterChipText, activeFilter === 'active' && styles.filterChipTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'delivered' && styles.filterChipActive]}
          onPress={() => handleFilterChange('delivered')}
        >
          <MaterialIcons
            name="check-circle"
            size={16}
            color={activeFilter === 'delivered' ? '#fff' : '#666'}
          />
          <Text style={[styles.filterChipText, activeFilter === 'delivered' && styles.filterChipTextActive]}>
            Delivered
          </Text>
        </TouchableOpacity>
      </View>

      {(orders?.length || 0) === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons
              name={activeFilter === 'active' ? 'local-shipping' : 'history'}
              size={64}
              color="#ccc"
            />
          </View>
          <Text style={styles.emptyTitle}>
            {activeFilter === 'active' ? 'No Active Deliveries' : 'No Completed Deliveries'}
          </Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'active'
              ? 'Accept orders from the Orders tab to start earning'
              : 'Your completed deliveries will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderDeliveryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchOrders}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#FF6B6B',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  paymentBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
    textTransform: 'uppercase',
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    lineHeight: 18,
  },
  landmark: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 4,
    fontStyle: 'italic',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  collectAmount: {
    color: '#4CAF50',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  pickupButton: {
    backgroundColor: '#2196F3',
  },
  startButton: {
    backgroundColor: '#FF9800',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deliveredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  deliveredText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
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
