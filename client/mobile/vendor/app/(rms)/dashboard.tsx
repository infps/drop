import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const QUICK_STATS = [
  { label: 'Tables Occupied', value: '8/12', icon: 'table-restaurant', color: '#FF6B6B' },
  { label: 'Pending Orders', value: '5', icon: 'receipt', color: '#FFA726' },
  { label: 'In Queue', value: '3', icon: 'people', color: '#4CAF50' },
  { label: 'Reservations', value: '7', icon: 'event', color: '#2196F3' },
];

const MENU_ITEMS = [
  { label: 'Tables', icon: 'table-restaurant', route: '/(rms)/tables', desc: 'Manage table status' },
  { label: 'Reservations', icon: 'event', route: '/(rms)/reservations', desc: 'View & manage bookings' },
  { label: 'Waitlist', icon: 'people', route: '/(rms)/waitlist', desc: 'Queue management' },
  { label: 'Kitchen Display', icon: 'restaurant', route: '/(rms)/kds', desc: 'Order preparation' },
  { label: 'Point of Sale', icon: 'point-of-sale', route: '/(rms)/pos', desc: 'Dine-in billing' },
  { label: 'Guests', icon: 'person-search', route: '/(rms)/guests', desc: 'Customer tracking' },
  { label: 'Staff', icon: 'badge', route: '/(rms)/staff', desc: 'Team management' },
  { label: 'Reports', icon: 'assessment', route: '/(rms)/reports', desc: 'Analytics & reports' },
];

export default function RMSDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        {QUICK_STATS.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <MaterialIcons name={stat.icon as any} size={24} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.alertCard}>
        <MaterialIcons name="notifications-active" size={20} color="#FFA726" />
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>2 tables waiting for bill</Text>
          <Text style={styles.alertDesc}>Tables 5, 8 requested checkout</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(rms)/tables')}>
          <Text style={styles.alertAction}>View</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.menuGrid}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.menuIconBox}>
              <MaterialIcons name={item.icon as any} size={28} color="#FF6B6B" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#333', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  alertCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 12, padding: 16, marginTop: 16, gap: 12,
  },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  alertDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  alertAction: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 24, marginBottom: 12 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  menuIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 12 },
  menuDesc: { fontSize: 12, color: '#666', marginTop: 4 },
  bottomSpacing: { height: 100 },
});
