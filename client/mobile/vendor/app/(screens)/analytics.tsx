import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>₹45,000</Text>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statChange}>+12% from last week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="receipt-long" size={24} color="#2196F3" />
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statChange}>+8% from last week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="shopping-cart" size={24} color="#FF9800" />
          <Text style={styles.statValue}>₹288</Text>
          <Text style={styles.statLabel}>Avg Order Value</Text>
          <Text style={styles.statChange}>+3% from last week</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="star" size={24} color="#FFD700" />
          <Text style={styles.statValue}>4.6</Text>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statChange}>245 reviews</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Items</Text>
        <View style={styles.card}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.itemRank}>{i}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>Menu Item {i}</Text>
                <Text style={styles.itemSales}>{50 - i * 5} orders</Text>
              </View>
              <Text style={styles.itemRevenue}>₹{(50 - i * 5) * 250}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.card}>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Avg Prep Time</Text>
            <Text style={styles.perfValue}>18 min</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Order Acceptance Rate</Text>
            <Text style={styles.perfValue}>94%</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Repeat Customers</Text>
            <Text style={styles.perfValue}>68%</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
