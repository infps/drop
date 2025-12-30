import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVendor } from '../../hooks/use-vendor';
import api from '../../lib/api';

export default function DeliverySettingsScreen() {
  const { vendor, fetchProfile } = useVendor();
  const [loading, setLoading] = useState(false);
  const [minOrder, setMinOrder] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [prepTime, setPrepTime] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  React.useEffect(() => {
    if (vendor) {
      setMinOrder(vendor.minimumOrder?.toString() || '0');
      setDeliveryRadius(vendor.deliveryRadius?.toString() || '5');
      setPrepTime(vendor.avgDeliveryTime?.toString() || '30');
    }
  }, [vendor]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/vendor/profile', {
        minimumOrder: parseFloat(minOrder) || 0,
        deliveryRadius: parseFloat(deliveryRadius) || 5,
        avgDeliveryTime: parseInt(prepTime) || 30,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Delivery settings updated');
        fetchProfile();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Minimum Order (₹)</Text>
          <TextInput
            style={styles.input}
            value={minOrder}
            onChangeText={setMinOrder}
            keyboardType="number-pad"
            placeholder="0"
          />
          <Text style={styles.hint}>Minimum order value for customers</Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Radius (km)</Text>
          <TextInput
            style={styles.input}
            value={deliveryRadius}
            onChangeText={setDeliveryRadius}
            keyboardType="number-pad"
            placeholder="5"
          />
          <Text style={styles.hint}>Maximum distance for delivery</Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Average Prep Time (mins)</Text>
          <TextInput
            style={styles.input}
            value={prepTime}
            onChangeText={setPrepTime}
            keyboardType="number-pad"
            placeholder="30"
          />
          <Text style={styles.hint}>Estimated time to prepare orders</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.infoText}>These settings affect order availability for customers in your area.</Text>
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
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  hint: { fontSize: 12, color: '#999', marginTop: 4 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF3E0', borderRadius: 8, padding: 12, marginTop: 16 },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  saveBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
