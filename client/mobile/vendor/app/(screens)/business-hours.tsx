import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVendor } from '../../hooks/use-vendor';
import api from '../../lib/api';

export default function BusinessHoursScreen() {
  const { vendor, fetchProfile } = useVendor();
  const [loading, setLoading] = useState(false);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  React.useEffect(() => {
    if (vendor) {
      setOpeningTime(vendor.openingTime || '09:00');
      setClosingTime(vendor.closingTime || '22:00');
    }
  }, [vendor]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/vendor/profile', {
        openingTime,
        closingTime,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Business hours updated');
        fetchProfile();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update hours');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <Text style={styles.label}>Opening Time</Text>
            <TextInput
              style={styles.input}
              value={openingTime}
              onChangeText={setOpeningTime}
              placeholder="09:00"
            />
          </View>
          <View style={styles.timeGroup}>
            <Text style={styles.label}>Closing Time</Text>
            <TextInput
              style={styles.input}
              value={closingTime}
              onChangeText={setClosingTime}
              placeholder="22:00"
            />
          </View>
        </View>

        <View style={styles.currentStatus}>
          <MaterialIcons
            name={vendor?.isActive ? 'check-circle' : 'cancel'}
            size={20}
            color={vendor?.isActive ? '#4CAF50' : '#999'}
          />
          <Text style={styles.statusText}>
            Store is currently {vendor?.isActive ? 'OPEN' : 'CLOSED'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.infoText}>Set your daily operating hours. Use 24-hour format (HH:MM).</Text>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  timeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  timeGroup: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  currentStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  statusText: { fontSize: 14, fontWeight: '600', color: '#333' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF3E0', borderRadius: 8, padding: 12, marginTop: 16 },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  saveBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
