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
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVendor } from '../../hooks/use-vendor';
import { formatCurrency, formatCurrencyCompact } from '../../utils/formatting';

type PeriodTab = 'today' | 'week' | 'month' | 'all';

const PERIOD_TABS: { key: PeriodTab; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

export default function EarningsScreen() {
  const { earnings, fetchEarnings, isLoading } = useVendor();
  const [activePeriod, setActivePeriod] = useState<PeriodTab>('today');
  const [refreshing, setRefreshing] = useState(false);

  const loadEarnings = useCallback(async () => {
    await fetchEarnings(activePeriod);
  }, [fetchEarnings, activePeriod]);

  useFocusEffect(
    useCallback(() => {
      loadEarnings();
    }, [loadEarnings])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEarnings();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {PERIOD_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activePeriod === tab.key && styles.tabActive,
              ]}
              onPress={() => setActivePeriod(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activePeriod === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
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
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Net Earnings</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(earnings?.netEarnings || 0)}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons name="payments" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>
                  {formatCurrencyCompact(earnings?.grossRevenue || 0)}
                </Text>
                <Text style={styles.statLabel}>Gross Revenue</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="remove-circle" size={24} color="#E53935" />
                <Text style={styles.statValue}>
                  {formatCurrencyCompact(earnings?.platformFees || 0)}
                </Text>
                <Text style={styles.statLabel}>Platform Fees</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Statistics</Text>
              <View style={styles.ordersCard}>
                <View style={styles.orderStat}>
                  <Text style={styles.orderStatValue}>
                    {earnings?.orders?.total || 0}
                  </Text>
                  <Text style={styles.orderStatLabel}>Total Orders</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.orderStat}>
                  <Text style={[styles.orderStatValue, { color: '#4CAF50' }]}>
                    {earnings?.orders?.delivered || 0}
                  </Text>
                  <Text style={styles.orderStatLabel}>Delivered</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.orderStat}>
                  <Text style={[styles.orderStatValue, { color: '#E53935' }]}>
                    {earnings?.orders?.cancelled || 0}
                  </Text>
                  <Text style={styles.orderStatLabel}>Cancelled</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payouts</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View History</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.payoutCard}>
                <View style={styles.payoutInfo}>
                  <MaterialIcons name="account-balance" size={24} color="#666" />
                  <View style={styles.payoutDetails}>
                    <Text style={styles.payoutLabel}>Next Payout</Text>
                    <Text style={styles.payoutValue}>
                      {formatCurrency(earnings?.netEarnings || 0)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.withdrawBtn}>
                  <Text style={styles.withdrawBtnText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
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
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  summaryCard: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  ordersCard: {
    flexDirection: 'row',
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
  orderStat: {
    flex: 1,
    alignItems: 'center',
  },
  orderStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  orderStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  payoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  payoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payoutDetails: {},
  payoutLabel: {
    fontSize: 12,
    color: '#666',
  },
  payoutValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  withdrawBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  withdrawBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
});
