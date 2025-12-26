import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function BankDetailsScreen() {
  const [accountNumber, setAccountNumber] = useState('****5678');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [accountName, setAccountName] = useState('Store Name Pvt Ltd');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.bankHeader}>
          <MaterialIcons name="account-balance" size={24} color="#666" />
          <Text style={styles.bankName}>Linked Bank Account</Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput style={styles.input} value={accountName} onChangeText={setAccountName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput style={styles.input} value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>IFSC Code</Text>
          <TextInput style={styles.input} value={ifscCode} onChangeText={setIfscCode} autoCapitalize="characters" />
        </View>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.infoText}>Your payouts will be transferred to this account. Ensure the details are correct.</Text>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Update Bank Details</Text>
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
  bankHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  bankName: { fontSize: 16, fontWeight: '600', color: '#333' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF3E0', borderRadius: 8, padding: 12, marginTop: 16 },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  saveBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
