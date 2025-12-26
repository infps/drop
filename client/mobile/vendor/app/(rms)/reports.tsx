import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ReportPeriod = 'today' | 'week' | 'month';

interface ReportData {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  tablesTurned: number;
  avgDineTime: string;
  topItems: { name: string; qty: number; revenue: number }[];
  hourlyBreakdown: { hour: string; orders: number; revenue: number }[];
  paymentBreakdown: { method: string; amount: number; percentage: number }[];
}

const MOCK_DATA: Record<ReportPeriod, ReportData> = {
  today: {
    revenue: 45680,
    orders: 67,
    avgOrderValue: 682,
    tablesTurned: 42,
    avgDineTime: '45 min',
    topItems: [
      { name: 'Chicken Biryani', qty: 28, revenue: 8960 },
      { name: 'Butter Naan', qty: 52, revenue: 2340 },
      { name: 'Paneer Tikka', qty: 18, revenue: 5040 },
      { name: 'Dal Makhani', qty: 22, revenue: 4840 },
      { name: 'Gulab Jamun', qty: 35, revenue: 2800 },
    ],
    hourlyBreakdown: [
      { hour: '12-1 PM', orders: 18, revenue: 12500 },
      { hour: '1-2 PM', orders: 22, revenue: 15200 },
      { hour: '7-8 PM', orders: 15, revenue: 10500 },
      { hour: '8-9 PM', orders: 12, revenue: 7480 },
    ],
    paymentBreakdown: [
      { method: 'UPI', amount: 23150, percentage: 51 },
      { method: 'Card', amount: 14200, percentage: 31 },
      { method: 'Cash', amount: 8330, percentage: 18 },
    ],
  },
  week: {
    revenue: 312400,
    orders: 428,
    avgOrderValue: 730,
    tablesTurned: 285,
    avgDineTime: '48 min',
    topItems: [
      { name: 'Chicken Biryani', qty: 186, revenue: 59520 },
      { name: 'Butter Naan', qty: 342, revenue: 15390 },
      { name: 'Paneer Tikka', qty: 124, revenue: 34720 },
      { name: 'Dal Makhani', qty: 156, revenue: 34320 },
      { name: 'Mutton Rogan Josh', qty: 88, revenue: 35200 },
    ],
    hourlyBreakdown: [],
    paymentBreakdown: [
      { method: 'UPI', amount: 156200, percentage: 50 },
      { method: 'Card', amount: 103100, percentage: 33 },
      { method: 'Cash', amount: 53100, percentage: 17 },
    ],
  },
  month: {
    revenue: 1245600,
    orders: 1680,
    avgOrderValue: 742,
    tablesTurned: 1120,
    avgDineTime: '46 min',
    topItems: [
      { name: 'Chicken Biryani', qty: 745, revenue: 238400 },
      { name: 'Paneer Tikka', qty: 512, revenue: 143360 },
      { name: 'Butter Naan', qty: 1380, revenue: 62100 },
      { name: 'Dal Makhani', qty: 628, revenue: 138160 },
      { name: 'Mutton Rogan Josh', qty: 356, revenue: 142400 },
    ],
    hourlyBreakdown: [],
    paymentBreakdown: [
      { method: 'UPI', amount: 622800, percentage: 50 },
      { method: 'Card', amount: 398600, percentage: 32 },
      { method: 'Cash', amount: 224200, percentage: 18 },
    ],
  },
};

export default function ReportsScreen() {
  const [period, setPeriod] = useState<ReportPeriod>('today');
  const data = MOCK_DATA[period];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.periodSelector}>
        {(['today', 'week', 'month'] as ReportPeriod[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="currency-rupee" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>₹{data.revenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="receipt-long" size={24} color="#2196F3" />
          <Text style={styles.statValue}>{data.orders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>₹{data.avgOrderValue}</Text>
          <Text style={styles.statLabel}>Avg Order</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="sync" size={24} color="#9C27B0" />
          <Text style={styles.statValue}>{data.tablesTurned}</Text>
          <Text style={styles.statLabel}>Table Turns</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Items</Text>
        <View style={styles.card}>
          {data.topItems.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index < data.topItems.length - 1 && styles.itemRowBorder]}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.qty} sold</Text>
              </View>
              <Text style={styles.itemRevenue}>₹{item.revenue.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <View style={styles.card}>
          {data.paymentBreakdown.map((payment) => (
            <View key={payment.method} style={styles.paymentRow}>
              <View style={styles.paymentInfo}>
                <MaterialIcons
                  name={payment.method === 'UPI' ? 'qr-code' : payment.method === 'Card' ? 'credit-card' : 'payments'}
                  size={20}
                  color="#666"
                />
                <Text style={styles.paymentMethod}>{payment.method}</Text>
              </View>
              <View style={styles.paymentStats}>
                <Text style={styles.paymentAmount}>₹{payment.amount.toLocaleString()}</Text>
                <View style={styles.percentageBar}>
                  <View style={[styles.percentageFill, { width: `${payment.percentage}%` }]} />
                </View>
                <Text style={styles.percentageText}>{payment.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {period === 'today' && data.hourlyBreakdown.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peak Hours</Text>
          <View style={styles.card}>
            {data.hourlyBreakdown.map((hour) => (
              <View key={hour.hour} style={styles.hourRow}>
                <Text style={styles.hourLabel}>{hour.hour}</Text>
                <View style={styles.hourStats}>
                  <Text style={styles.hourOrders}>{hour.orders} orders</Text>
                  <Text style={styles.hourRevenue}>₹{hour.revenue.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operations</Text>
        <View style={styles.card}>
          <View style={styles.opRow}>
            <View style={styles.opInfo}>
              <MaterialIcons name="schedule" size={20} color="#666" />
              <Text style={styles.opLabel}>Avg Dining Time</Text>
            </View>
            <Text style={styles.opValue}>{data.avgDineTime}</Text>
          </View>
          <View style={[styles.opRow, { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 }]}>
            <View style={styles.opInfo}>
              <MaterialIcons name="sync" size={20} color="#666" />
              <Text style={styles.opLabel}>Table Turnover Rate</Text>
            </View>
            <Text style={styles.opValue}>{(data.tablesTurned / 12).toFixed(1)}x</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.exportBtn}>
        <MaterialIcons name="file-download" size={20} color="#FF6B6B" />
        <Text style={styles.exportBtnText}>Export Report</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  periodSelector: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, marginBottom: 16 },
  periodBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  periodBtnActive: { backgroundColor: '#FF6B6B' },
  periodText: { fontSize: 14, fontWeight: '600', color: '#666' },
  periodTextActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  statValue: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rankBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  rankText: { fontSize: 14, fontWeight: '700', color: '#FF6B6B' },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemQty: { fontSize: 12, color: '#666', marginTop: 2 },
  itemRevenue: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  paymentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentMethod: { fontSize: 14, fontWeight: '500', color: '#333' },
  paymentStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentAmount: { fontSize: 14, fontWeight: '600', color: '#333', width: 80, textAlign: 'right' },
  percentageBar: { width: 60, height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 },
  percentageFill: { height: 6, backgroundColor: '#FF6B6B', borderRadius: 3 },
  percentageText: { fontSize: 12, color: '#666', width: 36, textAlign: 'right' },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  hourLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  hourStats: { flexDirection: 'row', gap: 16 },
  hourOrders: { fontSize: 13, color: '#666' },
  hourRevenue: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  opRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  opInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opLabel: { fontSize: 14, color: '#333' },
  opValue: { fontSize: 16, fontWeight: '700', color: '#FF6B6B' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 14, borderWidth: 2, borderColor: '#FF6B6B', borderRadius: 12 },
  exportBtnText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B' },
  bottomSpacing: { height: 100 },
});
