import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useOrders } from '../../hooks/use-orders';
import {
  formatCurrency,
  formatOrderDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '../../utils/formatting';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    currentOrder: order,
    fetchOrderById,
    acceptOrder,
    rejectOrder,
    markPreparing,
    markReady,
    isLoading,
  } = useOrders();
  const [actionLoading, setActionLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchOrderById(id);
      }
    }, [id, fetchOrderById])
  );

  const handleAction = async (action: 'accept' | 'reject' | 'preparing' | 'ready') => {
    if (!id) return;
    setActionLoading(true);
    try {
      switch (action) {
        case 'accept':
          await acceptOrder(id);
          break;
        case 'reject':
          await rejectOrder(id);
          break;
        case 'preparing':
          await markPreparing(id);
          break;
        case 'ready':
          await markReady(id);
          break;
      }
      await fetchOrderById(id);
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (isLoading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatOrderDate(order.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: ORDER_STATUS_COLORS[order.status] },
          ]}
        >
          <Text style={styles.statusText}>{formatOrderStatus(order.status)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.user.name}</Text>
              <Text style={styles.customerPhone}>{order.user.phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => handleCall(order.user.phone)}
            >
              <MaterialIcons name="call" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          {order.address && (
            <View style={styles.addressRow}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.addressText}>{order.address.address}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.card}>
          {order.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemRow,
                index < order.items.length - 1 && styles.itemRowBorder,
              ]}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.name}
                </Text>
                {item.notes && (
                  <Text style={styles.itemNotes}>{item.notes}</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill Summary</Text>
        <View style={styles.card}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{formatCurrency(order.deliveryFee)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount</Text>
              <Text style={[styles.billValue, { color: '#4CAF50' }]}>
                -{formatCurrency(order.discount)}
              </Text>
            </View>
          )}
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tax</Text>
            <Text style={styles.billValue}>{formatCurrency(order.tax)}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentMethod}>
              {order.paymentMethod === 'CASH' ? 'Cash on Delivery' : 'Online Payment'}
            </Text>
            <View
              style={[
                styles.paymentBadge,
                {
                  backgroundColor:
                    order.paymentStatus === 'PAID' ? '#E8F5E9' : '#FFF3E0',
                },
              ]}
            >
              <Text
                style={[
                  styles.paymentBadgeText,
                  {
                    color: order.paymentStatus === 'PAID' ? '#4CAF50' : '#FF9800',
                  },
                ]}
              >
                {formatPaymentStatus(order.paymentStatus)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {order.rider && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rider</Text>
          <View style={styles.card}>
            <View style={styles.customerRow}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{order.rider.name}</Text>
                <Text style={styles.customerPhone}>{order.rider.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => handleCall(order.rider!.phone)}
              >
                <MaterialIcons name="call" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actionsSection}>
        {actionLoading ? (
          <ActivityIndicator size="large" color="#FF6B6B" />
        ) : (
          <>
            {order.status === 'PENDING' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleAction('reject')}
                >
                  <MaterialIcons name="close" size={20} color="#E53935" />
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => handleAction('accept')}
                >
                  <MaterialIcons name="check" size={20} color="#fff" />
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
            {order.status === 'CONFIRMED' && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.fullBtn]}
                onPress={() => handleAction('preparing')}
              >
                <MaterialIcons name="restaurant" size={20} color="#fff" />
                <Text style={styles.acceptBtnText}>Start Preparing</Text>
              </TouchableOpacity>
            )}
            {order.status === 'PREPARING' && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.fullBtn]}
                onPress={() => handleAction('ready')}
              >
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.acceptBtnText}>Mark Ready for Pickup</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {},
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemNotes: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsSection: {
    padding: 16,
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  rejectBtn: {
    backgroundColor: '#FFEBEE',
  },
  rejectBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53935',
  },
  acceptBtn: {
    backgroundColor: '#FF6B6B',
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fullBtn: {
    backgroundColor: '#FF6B6B',
  },
  bottomSpacing: {
    height: 100,
  },
});
