import React, { useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/theme';
import { useOrders } from '../../hooks/use-orders';

export default function ActiveScreen() {
  const { orders, isLoading, fetchActiveOrders } = useOrders();

  useFocusEffect(
    useCallback(() => {
      fetchActiveOrders();
    }, [fetchActiveOrders])
  );

  if (isLoading && !(orders?.length)) {
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
      <View style={styles.header}>
        <Text style={styles.title}>Active Deliveries</Text>
        <Text style={styles.subtitle}>{orders?.length || 0} delivery(ies) in progress</Text>
      </View>

      {(orders?.length || 0) === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚚</Text>
          <Text style={styles.emptyTitle}>No Active Deliveries</Text>
          <Text style={styles.emptyText}>
            Accept orders from the Orders tab to start earning
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <View style={styles.deliveryCard}>
              <Text style={styles.orderId}>Order #{item.orderNumber}</Text>
              <Text style={styles.vendor}>{item.vendor?.name}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.list}
        />
      )}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  vendor: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
