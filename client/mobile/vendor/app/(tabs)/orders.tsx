import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useOrders } from '../../hooks/use-orders';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatRelativeTime, formatOrderStatus } from '../../utils/formatting';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

type FilterTab = 'NEW' | 'PREPARING' | 'READY' | 'ALL';

const FILTER_TABS: { key: FilterTab; label: string; status?: OrderStatus }[] = [
  { key: 'NEW', label: 'New', status: 'PENDING' },
  { key: 'PREPARING', label: 'Preparing', status: 'PREPARING' },
  { key: 'READY', label: 'Ready', status: 'READY_FOR_PICKUP' },
  { key: 'ALL', label: 'All' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const {
    orders,
    fetchOrders,
    acceptOrder,
    rejectOrder,
    markPreparing,
    markReady,
    isLoading,
  } = useOrders();
  const [activeTab, setActiveTab] = useState<FilterTab>('NEW');
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    const status = FILTER_TABS.find((t) => t.key === activeTab)?.status;
    await fetchOrders({ status });
  }, [activeTab, fetchOrders]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleAction = async (
    orderId: string,
    action: 'accept' | 'reject' | 'preparing' | 'ready'
  ) => {
    setActionLoading(orderId);
    try {
      switch (action) {
        case 'accept':
          await acceptOrder(orderId);
          break;
        case 'reject':
          await rejectOrder(orderId);
          break;
        case 'preparing':
          await markPreparing(orderId);
          break;
        case 'ready':
          await markReady(orderId);
          break;
      }
      await loadOrders();
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const renderOrderCard = (order: Order) => {
    const isActionLoading = actionLoading === order.id;

    return (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        onPress={() => router.push(`/(screens)/order-detail?id=${order.id}`)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: ORDER_STATUS_COLORS[order.status] + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: ORDER_STATUS_COLORS[order.status] },
              ]}
            >
              {formatOrderStatus(order.status)}
            </Text>
          </View>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.customerRow}>
            <MaterialIcons name="person" size={16} color="#666" />
            <Text style={styles.customerName}>{order.user.name}</Text>
          </View>
          <Text style={styles.orderTime}>{formatRelativeTime(order.createdAt)}</Text>
        </View>

        <View style={styles.itemsList}>
          {order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.name}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>+{order.items.length - 2} more</Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>

          {isActionLoading ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <View style={styles.actionButtons}>
              {order.status === 'PENDING' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleAction(order.id, 'reject')}
                  >
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => handleAction(order.id, 'accept')}
                  >
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </>
              )}
              {order.status === 'CONFIRMED' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => handleAction(order.id, 'preparing')}
                >
                  <Text style={styles.acceptBtnText}>Start Preparing</Text>
                </TouchableOpacity>
              )}
              {order.status === 'PREPARING' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => handleAction(order.id, 'ready')}
                >
                  <Text style={styles.acceptBtnText}>Mark Ready</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.ordersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        ) : (orders?.length ?? 0) === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          orders?.map(renderOrderCard)
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  tabsContainer: {
  },
  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabActive: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  ordersList: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  itemsList: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 12,
    color: '#999',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#f5f5f5',
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  acceptBtn: {
    backgroundColor: '#FF6B6B',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
});
