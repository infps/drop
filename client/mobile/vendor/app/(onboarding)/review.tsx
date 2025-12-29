import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleContinue = () => {
    router.push({
      pathname: '/(onboarding)/phone-verify',
      params,
    });
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );

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
          <View style={styles.progressDotDone} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review & Submit</Text>
        <Text style={styles.subtitle}>Please verify your information</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.card}>
            <InfoRow label="Business Name" value={params.businessName as string} />
            <InfoRow label="Business Type" value={params.businessType as string} />
            <InfoRow label="Cuisines" value={params.cuisines as string} />
            <InfoRow label="Description" value={params.description as string} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Details</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={params.ownerName as string} />
            <InfoRow label="Phone" value={`+91 ${params.phone}`} />
            <InfoRow label="Email" value={params.email as string} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.card}>
            <InfoRow label="GSTIN" value={params.gstNumber as string} />
            <InfoRow label="FSSAI" value={params.fssaiNumber as string} />
            <InfoRow label="PAN" value={params.panNumber as string} />
            <InfoRow label="Bank Account" value={`****${(params.bankAccount as string)?.slice(-4)}`} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Setup</Text>
          <View style={styles.card}>
            <InfoRow label="Address" value={params.address as string} />
            <InfoRow label="City" value={params.city as string} />
            <InfoRow label="Hours" value={`${params.openingTime} - ${params.closingTime}`} />
            <InfoRow label="Min Order" value={`₹${params.minOrder}`} />
            <InfoRow label="Delivery Radius" value={`${params.deliveryRadius} km`} />
          </View>
        </View>

        <View style={styles.disclaimer}>
          <MaterialIcons name="info" size={20} color="#666" />
          <Text style={styles.disclaimerText}>
            By submitting, you agree to our Terms of Service and confirm that all
            information provided is accurate.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleContinue}
        >
          <Text style={styles.submitBtnText}>Continue to Verify Phone</Text>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 32,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
