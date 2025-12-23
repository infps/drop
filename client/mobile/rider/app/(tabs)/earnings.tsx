import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useRider } from '../../hooks/use-rider';
import { formatCurrency } from '../../utils/formatting';

export default function EarningsScreen() {
  const router = useRouter();
  const {
    earnings,
    rider,
    pendingWithdrawal,
    isLoading,
    fetchEarnings,
    fetchPendingWithdrawal,
    requestWithdrawal,
    error,
    errorDetails,
    clearError
  } = useRider();
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month' | 'all'
  >('today');
  const [isRequesting, setIsRequesting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEarnings(selectedPeriod);
      fetchPendingWithdrawal();
    }, [fetchEarnings, fetchPendingWithdrawal, selectedPeriod])
  );

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'all') => {
    setSelectedPeriod(period);
  };

  const handleRequestWithdrawal = () => {
    const withdrawalAmount = earnings?.summary?.total ?? 0;

    // Check if there's a positive balance to withdraw
    if (withdrawalAmount <= 0) {
      Alert.alert('No Balance', 'You don\'t have any available balance to withdraw.');
      return;
    }

    // Check if bank account is set up
    if (!rider?.bankAccount || !rider?.ifscCode) {
      Alert.alert(
        'Bank Account Required',
        'Please add your bank account details before requesting a withdrawal.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Bank Account', onPress: () => router.push('/(profile)/bank-account') },
        ]
      );
      return;
    }

    Alert.alert(
      'Request Withdrawal',
      `Are you sure you want to withdraw ${formatCurrency(withdrawalAmount)} to your bank account ending in ****${rider.bankAccount.slice(-4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setIsRequesting(true);
              await requestWithdrawal(withdrawalAmount);
              Alert.alert(
                'Withdrawal Requested',
                'Your withdrawal request has been submitted. Funds will be transferred within 2-3 business days.',
                [{ text: 'OK' }]
              );
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to request withdrawal');
            } finally {
              setIsRequesting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading && !earnings) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.errorContainer}>
          <View style={styles.errorBox}>
            <View style={styles.errorTitleRow}>
              <MaterialIcons name="warning" size={20} color="#FF6B6B" />
              <Text style={styles.errorTitle}>Error Loading Earnings</Text>
            </View>
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
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
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
                <Text style={styles.summaryLabel}>Available Balance</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(earnings.summary.total)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Deliveries</Text>
                <Text style={styles.summaryValue}>
                  {earnings.summary.count || 0}
                </Text>
              </View>
            </View>

            {/* Balance Breakdown */}
            <View style={styles.breakdownSection}>
              <Text style={styles.sectionTitle}>Balance Summary</Text>

              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Total Earned</Text>
                <Text style={styles.breakdownValue}>
                  {formatCurrency(earnings.summary.totalEarned ?? 0)}
                </Text>
              </View>

              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Total Withdrawn</Text>
                <Text style={[styles.breakdownValue, { color: '#FF6B6B' }]}>
                  -{formatCurrency(earnings.summary.totalWithdrawn ?? 0)}
                </Text>
              </View>

              <View style={[styles.breakdownItem, styles.breakdownItemHighlight]}>
                <Text style={[styles.breakdownLabel, { fontWeight: '600' }]}>Available Balance</Text>
                <Text style={[styles.breakdownValue, { color: '#4CAF50', fontWeight: '700' }]}>
                  {formatCurrency(earnings.summary.total)}
                </Text>
              </View>
            </View>

            {/* Period Breakdown */}
            <View style={styles.breakdownSection}>
              <Text style={styles.sectionTitle}>Period Breakdown</Text>

              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Base Earnings</Text>
                <Text style={styles.breakdownValue}>
                  {formatCurrency(earnings.summary.baseEarning)}
                </Text>
              </View>

              {(earnings.summary.tips ?? 0) > 0 && (
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Tips</Text>
                  <Text style={styles.breakdownValue}>
                    +{formatCurrency(earnings.summary.tips)}
                  </Text>
                </View>
              )}
            </View>

            {/* Pending Withdrawal Card */}
            {pendingWithdrawal && (
              <View style={styles.pendingWithdrawalCard}>
                <View style={styles.pendingHeader}>
                  <MaterialIcons name="schedule" size={20} color="#FFA726" />
                  <Text style={styles.pendingTitle}>Pending Withdrawal</Text>
                </View>
                <View style={styles.pendingDetails}>
                  <Text style={styles.pendingAmount}>{formatCurrency(pendingWithdrawal.amount)}</Text>
                  <View style={styles.pendingStatusBadge}>
                    <Text style={styles.pendingStatusText}>
                      {pendingWithdrawal.status === 'PENDING' ? 'Processing' : pendingWithdrawal.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.pendingInfo}>
                  Requested on {new Date(pendingWithdrawal.requestedAt).toLocaleDateString()}
                </Text>
                <Text style={styles.pendingNote}>
                  Funds will be transferred to your bank account within 2-3 business days
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {!pendingWithdrawal ? (
                <TouchableOpacity
                  style={[
                    styles.withdrawButton,
                    ((earnings.summary.total ?? 0) <= 0 || isRequesting) && styles.withdrawButtonDisabled
                  ]}
                  disabled={(earnings.summary.total ?? 0) <= 0 || isRequesting}
                  onPress={handleRequestWithdrawal}
                >
                  {isRequesting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={[
                      styles.withdrawButtonText,
                      (earnings.summary.total ?? 0) <= 0 && styles.withdrawButtonTextDisabled
                    ]}>
                      Request Withdrawal
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.viewHistoryButton}
                  onPress={() => router.push('/(profile)/withdrawal-history')}
                >
                  <MaterialIcons name="history" size={18} color="#FF6B6B" />
                  <Text style={styles.viewHistoryButtonText}>View Withdrawal History</Text>
                </TouchableOpacity>
              )}
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
  errorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
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
  breakdownItemHighlight: {
    backgroundColor: '#f8fff8',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 0,
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
  withdrawButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  withdrawButtonTextDisabled: {
    color: '#999',
  },
  pendingWithdrawalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F57C00',
  },
  pendingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pendingAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  pendingStatusBadge: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
  },
  pendingInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  pendingNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  viewHistoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});
