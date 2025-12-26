import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DOCUMENTS = [
  { id: '1', name: 'GST Certificate', status: 'verified', date: '15 Jan 2024' },
  { id: '2', name: 'FSSAI License', status: 'verified', date: '20 Feb 2024' },
  { id: '3', name: 'PAN Card', status: 'verified', date: '10 Jan 2024' },
  { id: '4', name: 'Bank Account Proof', status: 'pending', date: '25 Dec 2024' },
];

export default function DocumentsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.infoCard}>
        <MaterialIcons name="verified" size={20} color="#4CAF50" />
        <Text style={styles.infoText}>All required documents are verified. Your store is active on Drop.</Text>
      </View>

      <View style={styles.docsList}>
        {DOCUMENTS.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docInfo}>
              <MaterialIcons name="description" size={24} color="#666" />
              <View style={styles.docDetails}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docDate}>Uploaded: {doc.date}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: doc.status === 'verified' ? '#E8F5E9' : '#FFF3E0' }]}>
              <Text style={[styles.statusText, { color: doc.status === 'verified' ? '#4CAF50' : '#FF9800' }]}>
                {doc.status === 'verified' ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.uploadBtn}>
        <MaterialIcons name="upload-file" size={20} color="#FF6B6B" />
        <Text style={styles.uploadBtnText}>Upload New Document</Text>
      </TouchableOpacity>

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
