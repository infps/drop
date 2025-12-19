import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/theme';
import { useRider } from '../../hooks/use-rider';
import { formatCurrency } from '../../utils/formatting';

export default function EarningsScreen() {
  const { earnings, isLoading, fetchEarnings } = useRider();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'all'
  >('today');

  useFocusEffect(
    useCallback(() => {
      fetchEarnings(selectedPeriod);
    }, [fetchEarnings, selectedPeriod])
  );

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'all') => {
    setSelectedPeriod(period);
  };

  if (isLoading && !earnings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Earnings</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        {earnings && (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Earnings</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(earnings.summary.totalEarning)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Deliveries</Text>
                <Text style={styles.summaryValue}>
                  {earnings.summary.totalDeliveries}
                </Text>
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.breakdownSection}>
              <Text style={styles.sectionTitle}>Earnings Breakdown</Text>

              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Base Earnings</Text>
                <Text style={styles.breakdownValue}>
                  {formatCurrency(earnings.summary.totalEarning)}
                </Text>
              </View>

              {earnings.summary.totalTips > 0 && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Tips</Text>
                  <Text style={styles.breakdownValue}>
                    +{formatCurrency(earnings.summary.totalTips)}
                  </Text>
                </View>
              )}

              {earnings.summary.totalIncentives > 0 && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Incentives</Text>
                  <Text style={styles.breakdownValue}>
                    +{formatCurrency(earnings.summary.totalIncentives)}
                  </Text>
                </View>
              )}

              {earnings.summary.totalPenalties > 0 && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Penalties</Text>
                  <Text style={[styles.breakdownValue, { color: '#FF6B6B' }]}>
                    -{formatCurrency(earnings.summary.totalPenalties)}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  divider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  breakdownSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  withdrawButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
