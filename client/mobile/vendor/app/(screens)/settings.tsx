import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TextInput, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [minOrder, setMinOrder] = useState('100');
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [prepTime, setPrepTime] = useState('30');
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Opening Time</Text>
              <TextInput style={styles.input} value={openingTime} onChangeText={setOpeningTime} />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Closing Time</Text>
              <TextInput style={styles.input} value={closingTime} onChangeText={setClosingTime} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Settings</Text>
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Minimum Order (₹)</Text>
            <TextInput style={styles.input} value={minOrder} onChangeText={setMinOrder} keyboardType="number-pad" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Radius (km)</Text>
            <TextInput style={styles.input} value={deliveryRadius} onChangeText={setDeliveryRadius} keyboardType="number-pad" />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Average Prep Time (mins)</Text>
            <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="number-pad" />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>New Order Alerts</Text>
              <Text style={styles.toggleDesc}>Get notified for new orders</Text>
            </View>
            <Switch value={orderNotifications} onValueChange={setOrderNotifications} trackColor={{ false: '#ddd', true: '#FF6B6B' }} thumbColor="#fff" />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Sound</Text>
              <Text style={styles.toggleDesc}>Play sound for notifications</Text>
            </View>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ false: '#ddd', true: '#FF6B6B' }} thumbColor="#fff" />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  row: { flexDirection: 'row', gap: 12 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#333' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  toggleInfo: {},
  toggleLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  toggleDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  saveBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
