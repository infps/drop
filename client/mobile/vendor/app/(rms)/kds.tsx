import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type OrderType = 'dine-in' | 'delivery' | 'pickup';
type KDSOrderStatus = 'new' | 'preparing' | 'ready';

interface KDSOrder {
  id: string;
  orderNumber: string;
  type: OrderType;
  tableNumber?: number;
  items: { name: string; qty: number; notes?: string }[];
  createdAt: string;
  status: KDSOrderStatus;
  priority: boolean;
}

const MOCK_ORDERS: KDSOrder[] = [
  { id: '1', orderNumber: '#1240', type: 'dine-in', tableNumber: 3, items: [{ name: 'Chicken Biryani', qty: 2 }, { name: 'Butter Naan', qty: 4, notes: 'Extra butter' }], createdAt: '5 min ago', status: 'new', priority: true },
  { id: '2', orderNumber: '#1241', type: 'delivery', items: [{ name: 'Paneer Tikka', qty: 1 }, { name: 'Veg Biryani', qty: 1 }], createdAt: '8 min ago', status: 'preparing', priority: false },
  { id: '3', orderNumber: '#1242', type: 'dine-in', tableNumber: 7, items: [{ name: 'Dal Makhani', qty: 2 }, { name: 'Jeera Rice', qty: 2 }, { name: 'Raita', qty: 2 }], createdAt: '3 min ago', status: 'new', priority: false },
  { id: '4', orderNumber: '#1243', type: 'pickup', items: [{ name: 'Chicken Tikka', qty: 1 }], createdAt: '12 min ago', status: 'ready', priority: false },
  { id: '5', orderNumber: '#1244', type: 'dine-in', tableNumber: 5, items: [{ name: 'Mutton Rogan Josh', qty: 1 }, { name: 'Garlic Naan', qty: 2 }], createdAt: '6 min ago', status: 'preparing', priority: true },
];

const TYPE_CONFIG: Record<OrderType, { label: string; icon: string; color: string }> = {
  'dine-in': { label: 'Dine-in', icon: 'restaurant', color: '#2196F3' },
  delivery: { label: 'Delivery', icon: 'delivery-dining', color: '#FF6B6B' },
  pickup: { label: 'Pickup', icon: 'shopping-bag', color: '#4CAF50' },
};

const STATUS_COLORS: Record<KDSOrderStatus, string> = {
  new: '#FFA726',
  preparing: '#2196F3',
  ready: '#4CAF50',
};

export default function KDSScreen() {
  const [filter, setFilter] = useState<KDSOrderStatus | 'all'>('all');

  const filteredOrders = filter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  const getStatusCounts = () => ({
    all: MOCK_ORDERS.length,
    new: MOCK_ORDERS.filter(o => o.status === 'new').length,
    preparing: MOCK_ORDERS.filter(o => o.status === 'preparing').length,
    ready: MOCK_ORDERS.filter(o => o.status === 'ready').length,
  });

  const counts = getStatusCounts();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {(['all', 'new', 'preparing', 'ready'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.filterChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filteredOrders.map((order) => {
          const typeConfig = TYPE_CONFIG[order.type];
          return (
            <View key={order.id} style={[styles.card, order.priority && styles.cardPriority]}>
              <View style={styles.cardHeader}>
                <View style={styles.orderInfo}>
                  <View style={styles.orderNumberRow}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    {order.priority && (
                      <View style={styles.priorityBadge}>
                        <MaterialIcons name="priority-high" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                  <View style={styles.typeRow}>
                    <MaterialIcons name={typeConfig.icon as any} size={14} color={typeConfig.color} />
                    <Text style={[styles.typeText, { color: typeConfig.color }]}>{typeConfig.label}</Text>
                    {order.tableNumber && <Text style={styles.tableText}>• Table {order.tableNumber}</Text>}
                  </View>
                </View>
                <View style={styles.timeBox}>
                  <MaterialIcons name="schedule" size={14} color="#666" />
                  <Text style={styles.timeText}>{order.createdAt}</Text>
                </View>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={styles.qtyBox}>
                      <Text style={styles.qtyText}>{item.qty}x</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusIndicator, { backgroundColor: STATUS_COLORS[order.status] }]}>
                  <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
                <View style={styles.actions}>
                  {order.status === 'new' && (
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialIcons name="play-arrow" size={20} color="#fff" />
                      <Text style={styles.actionText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'preparing' && (
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnReady]}>
                      <MaterialIcons name="check" size={20} color="#fff" />
                      <Text style={styles.actionText}>Ready</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'ready' && (
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnComplete]}>
                      <MaterialIcons name="done-all" size={20} color="#fff" />
                      <Text style={styles.actionText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  filterBar: { flexGrow: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#2a2a2a' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#3a3a3a', marginRight: 8 },
  filterChipActive: { backgroundColor: '#FF6B6B' },
  filterText: { fontSize: 14, color: '#999' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#2a2a2a', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#3a3a3a',
  },
  cardPriority: { borderLeftColor: '#FF6B6B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderInfo: {},
  orderNumberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderNumber: { fontSize: 20, fontWeight: '700', color: '#fff' },
  priorityBadge: { backgroundColor: '#FF6B6B', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  typeText: { fontSize: 13, fontWeight: '500' },
  tableText: { fontSize: 13, color: '#999', marginLeft: 4 },
  timeBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#3a3a3a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  timeText: { fontSize: 13, color: '#999' },
  itemsList: { marginTop: 16, gap: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  qtyBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#3a3a3a', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, color: '#fff' },
  itemNotes: { fontSize: 13, color: '#FFA726', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#3a3a3a' },
  statusIndicator: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  actions: {},
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFA726', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  actionBtnReady: { backgroundColor: '#4CAF50' },
  actionBtnComplete: { backgroundColor: '#2196F3' },
  actionText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
