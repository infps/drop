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

export default function StoreSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [prepTime, setPrepTime] = useState('30');
  const [minOrder, setMinOrder] = useState('100');
  const [deliveryRadius, setDeliveryRadius] = useState('5');

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/review',
      params: {
        ...params,
        address,
        city,
        pincode,
        landmark,
        openingTime,
        closingTime,
        prepTime,
        minOrder,
        deliveryRadius,
      },
    });
  };

  const isValid = address && city && pincode;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progress}>
          <View style={styles.progressDotDone} />
          <View style={styles.progressDotDone} />
          <View style={styles.progressDotDone} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Store Setup</Text>
        <Text style={styles.subtitle}>Location and operating details</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Location</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter complete address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="Nearby landmark"
              placeholderTextColor="#999"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Opening Time</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00"
                placeholderTextColor="#999"
                value={openingTime}
                onChangeText={setOpeningTime}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Closing Time</Text>
              <TextInput
                style={styles.input}
                placeholder="22:00"
                placeholderTextColor="#999"
                value={closingTime}
                onChangeText={setClosingTime}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Settings</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Prep Time (mins)</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Min Order (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={minOrder}
                onChangeText={setMinOrder}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Radius (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={deliveryRadius}
              onChangeText={setDeliveryRadius}
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
          <Text style={styles.nextBtnText}>Review</Text>
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
  textArea: {
    height: 80,
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
