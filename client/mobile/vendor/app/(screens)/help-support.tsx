import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HelpSupportScreen() {
  const handleContactEmail = () => {
    Linking.openURL('mailto:support@drop.com');
  };

  const handleContactPhone = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/911234567890');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="support-agent" size={48} color="#FF6B6B" />
        <Text style={styles.headerTitle}>We're here to help</Text>
        <Text style={styles.headerDesc}>Get in touch with our support team</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionCard} onPress={handleContactEmail}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="email" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Email Support</Text>
            <Text style={styles.actionDesc}>support@drop.com</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleContactPhone}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="phone" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Call Us</Text>
            <Text style={styles.actionDesc}>+91 123 456 7890</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleWhatsApp}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="chat" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>WhatsApp</Text>
            <Text style={styles.actionDesc}>Chat with us instantly</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>How do I update my menu?</Text>
          <Text style={styles.faqAnswer}>Go to Menu tab, select an item to edit or add new items.</Text>
        </View>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>When do I receive payouts?</Text>
          <Text style={styles.faqAnswer}>Payouts are processed weekly to your linked bank account.</Text>
        </View>
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>How do I handle order issues?</Text>
          <Text style={styles.faqAnswer}>Contact support immediately for order-related problems.</Text>
        </View>
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
  headerDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: { flex: 1, marginLeft: 16 },
  actionTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  actionDesc: { fontSize: 14, color: '#666', marginTop: 2 },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  faqAnswer: { fontSize: 14, color: '#666', lineHeight: 20 },
  bottomSpacing: { height: 100 },
});
