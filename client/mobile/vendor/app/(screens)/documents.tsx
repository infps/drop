import React, { useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useVendor } from '../../hooks/use-vendor';

export default function DocumentsScreen() {
  const { vendor, fetchProfile } = useVendor();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const documents = [
    {
      id: '1',
      name: 'GST Certificate',
      value: vendor?.gstNumber,
      status: vendor?.gstNumber ? 'verified' : 'pending',
    },
    {
      id: '2',
      name: 'FSSAI License',
      value: vendor?.fssaiNumber,
      status: vendor?.fssaiNumber ? 'verified' : 'pending',
    },
    {
      id: '3',
      name: 'PAN Card',
      value: vendor?.panNumber,
      status: vendor?.panNumber ? 'verified' : 'pending',
    },
  ];

  const allVerified = documents.every((doc) => doc.status === 'verified');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.infoCard, { backgroundColor: allVerified ? '#E8F5E9' : '#FFF3E0' }]}>
        <MaterialIcons
          name={allVerified ? 'verified' : 'info'}
          size={20}
          color={allVerified ? '#4CAF50' : '#FF9800'}
        />
        <Text style={styles.infoText}>
          {allVerified
            ? 'All required documents are verified. Your store is active on Drop.'
            : 'Some documents are missing or pending verification.'}
        </Text>
      </View>

      <View style={styles.docsList}>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docInfo}>
              <MaterialIcons name="description" size={24} color="#666" />
              <View style={styles.docDetails}>
                <Text style={styles.docName}>{doc.name}</Text>
                {doc.value && <Text style={styles.docDate}>{doc.value}</Text>}
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: doc.status === 'verified' ? '#E8F5E9' : '#FFF3E0' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: doc.status === 'verified' ? '#4CAF50' : '#FF9800' },
                ]}
              >
                {doc.status === 'verified' ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.infoText}>
          Contact support to update your documents. Upload functionality coming soon.
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16 },
  infoText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  docsList: { marginTop: 24 },
  docCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  docInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docDetails: {},
  docName: { fontSize: 14, fontWeight: '600', color: '#333' },
  docDate: { fontSize: 12, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: '#FF6B6B', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 16, marginTop: 16 },
  uploadBtnText: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
  bottomSpacing: { height: 100 },
});
