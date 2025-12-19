import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { useRider } from '../../hooks/use-rider';
import { useOrders } from '../../hooks/use-orders';
import { formatCurrency, formatOrderStatus } from '../../utils/formatting';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rider, isLoading: riderLoading, refresh } = useRider();
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

  const onRefresh = async () => {
    await refresh();
    await fetchActiveOrders();
  };

  if (riderLoading && !rider) {
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
            <Text style={styles.greeting}>Hello, {user?.name || 'Rider'}! 👋</Text>
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
              <TouchableOpacity style={styles.toggleButton}>
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
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionTitle}>Available Orders</Text>
              <Text style={styles.actionSubText}>Browse & accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewActive}
            >
              <Text style={styles.actionIcon}>🚗</Text>
              <Text style={styles.actionTitle}>Active Deliveries</Text>
              <Text style={styles.actionSubText}>
                {activeOrders.length} orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewEarnings}
            >
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionTitle}>Today's Earnings</Text>
              <Text style={styles.actionSubText}>
                {formatCurrency(rider?.totalEarnings || 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionTitle}>Your Profile</Text>
              <Text style={styles.actionSubText}>Edit details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Incentive Banner */}
        <View style={styles.incentiveSection}>
          <Text style={styles.incentiveTitle}>🎁 Special Incentives</Text>
          <Text style={styles.incentiveText}>
            Complete 10 orders this week and earn ₹500 bonus!
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((activeOrders.length || 0) / 10) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {activeOrders.length} / 10 orders
          </Text>
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>✅</Text>
            <Text style={styles.tipText}>
              Always verify customer details before delivery
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>📍</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 32,
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
    backgroundColor: '#FFE5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  incentiveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  incentiveText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FFD4E5',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
    gap: 12,
  },
  tipIcon: {
    fontSize: 20,
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
