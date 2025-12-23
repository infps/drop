import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { useRider } from '../../hooks/use-rider';
import { useOrders } from '../../hooks/use-orders';
import { formatCurrency, formatOrderStatus } from '../../utils/formatting';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rider, isLoading: riderLoading, refresh, setOnlineStatus } = useRider();
  const { orders: activeOrders, fetchActiveOrders } = useOrders();

  useFocusEffect(
    useCallback(() => {
      refresh();
      fetchActiveOrders();
    }, [refresh, fetchActiveOrders])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewOrders = () => {
    router.push('/(tabs)/orders');
  };

  const handleViewActive = () => {
    router.push('/(tabs)/active');
  };

  const handleViewEarnings = () => {
    router.push('/(tabs)/earnings');
  };

  const handleToggleOnline = async () => {
    if (!rider) return;
    try {
      await setOnlineStatus(!rider.isOnline);
      await refresh();
    } catch (error) {
      console.error('Failed to toggle online status:', error);
    }
  };

  const onRefresh = async () => {
    await refresh();
    await fetchActiveOrders();
  };

  if (riderLoading && !rider) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={riderLoading} onRefresh={onRefresh} tintColor="#FF6B6B" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Hello, {user?.name || 'Rider'}!</Text>
              <MaterialIcons name="waving-hand" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.subGreeting}>Ready to earn?</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        {rider && (
          <View style={styles.statusCard}>
            <View style={styles.statusContent}>
              <View style={styles.statusLeft}>
                <View
                  style={[
                    styles.statusIndicator,
                    rider.isOnline && styles.statusOnline,
                  ]}
                />
                <View>
                  <Text style={styles.statusLabel}>
                    {rider.isOnline ? 'Online' : 'Offline'}
                  </Text>
                  <Text style={styles.statusSubText}>
                    {rider.isAvailable ? 'Available' : 'Busy'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.toggleButton} onPress={handleToggleOnline}>
                <Text style={styles.toggleButtonText}>
                  {rider.isOnline ? 'Go Offline' : 'Go Online'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Section */}
        {rider && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rider.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Total Deliveries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatCurrency(rider.totalEarnings)}
              </Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rider.rating.toFixed(1)}⭐</Text>
              <Text style={styles.statLabel}>Your Rating</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewOrders}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="inbox" size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.actionTitle}>Available Orders</Text>
              <Text style={styles.actionSubText}>Browse & accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewActive}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="local-shipping" size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.actionTitle}>Active Deliveries</Text>
              <Text style={styles.actionSubText}>
                {activeOrders?.length || 0} orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewEarnings}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="account-balance-wallet" size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.actionTitle}>Today's Earnings</Text>
              <Text style={styles.actionSubText}>
                {formatCurrency(rider?.totalEarnings || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="person" size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.actionTitle}>Your Profile</Text>
              <Text style={styles.actionSubText}>Edit details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Incentive Banner */}
        <View style={styles.incentiveSection}>
          <View style={styles.incentiveTitleRow}>
            <MaterialIcons name="card-giftcard" size={20} color="#fff" />
            <Text style={styles.incentiveTitle}>Special Incentives</Text>
          </View>
          <Text style={styles.incentiveText}>
            Complete 10 orders this week and earn ₹500 bonus!
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((activeOrders?.length || 0) / 10) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {activeOrders?.length || 0} / 10 orders
          </Text>
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Always verify customer details before delivery
            </Text>
          </View>
          <View style={styles.tipCard}>
            <MaterialIcons name="location-on" size={20} color="#FF6B6B" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              Keep your location updated for better order matching
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingSection: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFE5E5',
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusSubText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
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
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
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
  actionIconContainer: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  incentiveSection: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  incentiveTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  incentiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  incentiveText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
});
