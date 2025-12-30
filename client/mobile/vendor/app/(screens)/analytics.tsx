import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from '../../lib/api';

interface AnalyticsData {
  thisWeekRevenue: number;
  revenueChange: string;
  thisWeekOrders: number;
  orderChange: string;
  avgOrderValue: number;
  rating: number;
  totalReviews: number;
  topItems: Array<{ name: string; orders: number; revenue: number }>;
  avgPrepTime: number;
  acceptanceRate: string;
}

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/analytics');
      if (res.data.status === 'success') {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>₹{data?.thisWeekRevenue || 0}</Text>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statChange}>{data?.revenueChange || '0%'} from last week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="receipt-long" size={24} color="#2196F3" />
          <Text style={styles.statValue}>{data?.thisWeekOrders || 0}</Text>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statChange}>{data?.orderChange || '0%'} from last week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="shopping-cart" size={24} color="#FF9800" />
          <Text style={styles.statValue}>₹{data?.avgOrderValue || 0}</Text>
          <Text style={styles.statLabel}>Avg Order Value</Text>
          <Text style={styles.statChange}>This week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="star" size={24} color="#FFD700" />
          <Text style={styles.statValue}>{data?.rating?.toFixed(1) || 0}</Text>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statChange}>{data?.totalReviews || 0} reviews</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Items</Text>
        <View style={styles.card}>
          {data?.topItems && data.topItems.length > 0 ? (
            data.topItems.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.itemRank}>{i + 1}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSales}>{item.orders} orders</Text>
                </View>
                <Text style={styles.itemRevenue}>₹{item.revenue}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No data available</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.card}>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Avg Prep Time</Text>
            <Text style={styles.perfValue}>{data?.avgPrepTime || 0} min</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Order Acceptance Rate</Text>
            <Text style={styles.perfValue}>{data?.acceptanceRate || '0%'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
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
      android: { elevation: 4 },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statChange: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
      android: { elevation: 4 },
    }),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemRank: {
    width: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemSales: {
    fontSize: 12,
    color: '#666',
  },
  itemRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  perfLabel: {
    fontSize: 14,
    color: '#666',
  },
  perfValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomSpacing: {
    height: 100,
  },
});
