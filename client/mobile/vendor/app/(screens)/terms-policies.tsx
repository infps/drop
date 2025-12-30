import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TermsPoliciesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="policy" size={48} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Terms & Policies</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Terms of Service</Text>
        <Text style={styles.paragraph}>
          By using Drop as a vendor, you agree to comply with all applicable laws and regulations.
          You are responsible for maintaining accurate menu information, pricing, and availability.
        </Text>
        <Text style={styles.paragraph}>
          Drop reserves the right to suspend or terminate vendor accounts that violate these terms
          or provide poor service quality.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commission & Payments</Text>
        <Text style={styles.paragraph}>
          Drop charges a commission on each completed order. Commission rates are agreed upon during
          onboarding and may be adjusted with prior notice.
        </Text>
        <Text style={styles.paragraph}>
          Payments are processed weekly to your linked bank account. Ensure your bank details are
          accurate to avoid payment delays.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quality Standards</Text>
        <Text style={styles.paragraph}>
          Vendors must maintain high food safety and hygiene standards. All required licenses
          (FSSAI, GST) must be valid and up-to-date.
        </Text>
        <Text style={styles.paragraph}>
          Orders must be prepared within the estimated time. Consistent delays or cancellations
          may result in penalties or account suspension.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We collect and process vendor data to facilitate order management and payments. Your
          information is stored securely and not shared with third parties without consent.
        </Text>
        <Text style={styles.paragraph}>
          Customer data provided for order fulfillment must be handled confidentially and only
          used for delivery purposes.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#666" />
        <Text style={styles.infoText}>
          Last updated: December 2024. Contact support for questions about our terms and policies.
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginTop: 16 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  paragraph: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 12 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  bottomSpacing: { height: 100 },
});
