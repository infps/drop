import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVendor } from '../../hooks/use-vendor';
import { useOrders } from '../../hooks/use-orders';
import { formatCurrency, formatCurrencyCompact } from '../../utils/formatting';

export default function HomeScreen() {
  const router = useRouter();
  const { vendor, stats, fetchProfile, setOnlineStatus, isLoading } = useVendor();
  const { orders, fetchOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await Promise.all([fetchProfile(), fetchOrders({ status: 'PENDING' })]);
  }, [fetchProfile, fetchOrders]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleStatus = async (value: boolean) => {
    try {
      await setOnlineStatus(value);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.storeName}>{vendor?.name || 'Your Store'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialIcons name="notifications-none" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: vendor?.isActive ? '#4CAF50' : '#ccc' },
                ]}
              />
              <Text style={styles.statusText}>
                {vendor?.isActive ? 'Store is Online' : 'Store is Offline'}
              </Text>
            </View>
            <Switch
              value={vendor?.isActive || false}
              onValueChange={handleToggleStatus}
              trackColor={{ false: '#ddd', true: '#FF6B6B' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {pendingOrders.length > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <MaterialIcons name="notifications-active" size={24} color="#fff" />
            <Text style={styles.alertText}>
              {pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''} waiting
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="receipt-long" size={24} color="#FF6B6B" />
            <Text style={styles.statValue}>{stats?.todayOrders || 0}</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="currency-rupee" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>
              {formatCurrencyCompact(stats?.todayRevenue || 0)}
            </Text>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="pending-actions" size={24} color="#FFA726" />
            <Text style={styles.statValue}>{stats?.activeOrders || 0}</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="star" size={24} color="#FFD700" />
            <Text style={styles.statValue}>{vendor?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/menu')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcons name="add-circle" size={24} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(rms)/dashboard')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="table-restaurant" size={24} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Dine-In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(screens)/analytics')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcons name="analytics" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(screens)/reviews')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FCE4EC' }]}>
                <MaterialIcons name="rate-review" size={24} color="#E91E63" />
              </View>
              <Text style={styles.actionText}>Reviews</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  storeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alertCard: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 8,
  },
  statCard: {
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomSpacing: {
    height: 100,
  },
});
