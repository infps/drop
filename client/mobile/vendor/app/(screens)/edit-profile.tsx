import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';

export default function EditProfileScreen() {
  const [name, setName] = useState('Your Store Name');
  const [description, setDescription] = useState('Store description here');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('store@example.com');
  const [address, setAddress] = useState('123 Main Street');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Store Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} textAlignVertical="top" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} multiline numberOfLines={2} textAlignVertical="top" />
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
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  form: {},
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: { height: 80 },
  saveBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  bottomSpacing: { height: 100 },
});
