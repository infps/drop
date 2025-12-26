import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function DocumentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [gstNumber, setGstNumber] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/store-setup',
      params: {
        ...params,
        gstNumber,
        fssaiNumber,
        panNumber,
        bankAccount,
        ifscCode,
      },
    });
  };

  const isValid = gstNumber && fssaiNumber && panNumber && bankAccount && ifscCode;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progress}>
          <View style={styles.progressDotDone} />
          <View style={styles.progressDotDone} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>Business verification documents</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tax Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>GSTIN *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 15-digit GSTIN"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={15}
              value={gstNumber}
              onChangeText={setGstNumber}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>FSSAI License Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 14-digit FSSAI number"
              placeholderTextColor="#999"
              maxLength={14}
              keyboardType="number-pad"
              value={fssaiNumber}
              onChangeText={setFssaiNumber}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PAN Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit PAN"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={10}
              value={panNumber}
              onChangeText={setPanNumber}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bank Account Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={bankAccount}
              onChangeText={setBankAccount}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>IFSC Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC code"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={11}
              value={ifscCode}
              onChangeText={setIfscCode}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  progressDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  progressDotActive: {
    backgroundColor: '#FF6B6B',
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  nextBtnDisabled: {
    backgroundColor: '#ccc',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
