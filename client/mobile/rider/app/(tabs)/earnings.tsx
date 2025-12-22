import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/theme';
import { useRider } from '../../hooks/use-rider';
import { formatCurrency } from '../../utils/formatting';

export default function EarningsScreen() {
  const { earnings, isLoading, fetchEarnings, error, errorDetails, clearError } = useRider();
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

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.errorContainer}>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠️ Error Loading Earnings</Text>
            <Text style={styles.errorMessage}>{error}</Text>

            {errorDetails && (
              <View style={styles.errorDetails}>
                <Text style={styles.detailsLabel}>Error Details:</Text>
                {errorDetails.statusCode && (
                  <Text style={styles.detailsText}>Status Code: {errorDetails.statusCode}</Text>
                )}
                {errorDetails.code && (
                  <Text style={styles.detailsText}>Error Code: {errorDetails.code}</Text>
                )}
                {errorDetails.details && (
                  <Text style={styles.detailsText}>
                    Details: {JSON.stringify(errorDetails.details, null, 2)}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                clearError();
                fetchEarnings(selectedPeriod);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  errorContainer: {
    flex: 1,
    padding: 16,
  },
  errorBox: {
    backgroundColor: '#fff3f3',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorDetails: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  detailsText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Courier New',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
