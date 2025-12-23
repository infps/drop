import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { formatCurrency } from '../../utils/formatting';
import { useRider } from '../../hooks/use-rider';
import { WithdrawalStatus } from '../../types';

export default function WithdrawalHistoryScreen() {
  const router = useRouter();
  const { withdrawals, isLoading, fetchWithdrawals } = useRider();

  useFocusEffect(
    useCallback(() => {
      fetchWithdrawals();
    }, [fetchWithdrawals])
  );

  const getStatusColor = (status: WithdrawalStatus) => {
    switch (status) {
      case 'COMPLETED':
        return '#4CAF50';
      case 'PENDING':
      case 'PROCESSING':
        return '#FFA726';
      case 'FAILED':
        return '#FF6B6B';
      default:
        return '#ccc';
    }
  };

  const getStatusIcon = (status: WithdrawalStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'check-circle';
      case 'PENDING':
      case 'PROCESSING':
        return 'schedule';
      case 'FAILED':
        return 'error';
      default:
        return 'help';
    }
  };

  const formatStatus = (status: WithdrawalStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'PROCESSING':
        return 'Processing';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const withdrawalList = withdrawals?.withdrawals || [];

  if (isLoading && !withdrawals) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdrawal History</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchWithdrawals}
            tintColor="#FF6B6B"
          />
        }
      >
        {withdrawalList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="payment" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Withdrawals Yet</Text>
            <Text style={styles.emptyText}>
              Your withdrawal history will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.listSection}>
            {withdrawalList.map((withdrawal) => (
              <View key={withdrawal.id} style={styles.withdrawalCard}>
                <View style={styles.withdrawalLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: getStatusColor(withdrawal.status) + '20' }
                    ]}
                  >
                    <MaterialIcons
                      name={getStatusIcon(withdrawal.status) as any}
                      size={24}
                      color={getStatusColor(withdrawal.status)}
                    />
                  </View>
                  <View style={styles.withdrawalInfo}>
                    <Text style={styles.amount}>{formatCurrency(withdrawal.amount)}</Text>
                    <Text style={styles.date}>
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </Text>
                    {withdrawal.transactionId && (
                      <Text style={styles.transactionId}>ID: {withdrawal.transactionId}</Text>
                    )}
                    {withdrawal.failureReason && (
                      <Text style={styles.failureReason}>{withdrawal.failureReason}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.withdrawalRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(withdrawal.status) + '20' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(withdrawal.status) }
                      ]}
                    >
                      {formatStatus(withdrawal.status)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  listSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  withdrawalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  withdrawalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawalInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  transactionId: {
    fontSize: 11,
    color: '#999',
  },
  failureReason: {
    fontSize: 11,
    color: '#FF6B6B',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawalRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
