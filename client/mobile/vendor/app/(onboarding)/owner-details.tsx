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

export default function OwnerDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');

  const fillTest = () => {
    setOwnerName('Test Owner');
    setPhone('9876543210');
    setAlternatePhone('9876543211');
    setEmail('test@vendor.com');
  };

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/documents',
      params: {
        ...params,
        ownerName,
        phone,
        alternatePhone,
        email,
      },
    });
  };

  const isValid = ownerName && phone.length === 10 && email;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progress}>
          <View style={styles.progressDotDone} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Owner Details</Text>
            <Text style={styles.subtitle}>Contact information for your account</Text>
          </View>
          {__DEV__ && (
            <TouchableOpacity style={styles.fillTestBtn} onPress={fillTest}>
              <Text style={styles.fillTestText}>Fill Test</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={ownerName}
            onChangeText={setOwnerName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.phoneInputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alternate Phone</Text>
          <View style={styles.phoneInputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={alternatePhone}
              onChangeText={setAlternatePhone}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.helperText}>
            This email will be used for settlements and communications
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  fillTestBtn: {
    backgroundColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  fillTestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 24,
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
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  phoneVerified: {
    backgroundColor: '#f0fff0',
    borderColor: '#4CAF50',
  },
  phoneText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 32,
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
