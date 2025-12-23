import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';

export default function HelpSupportScreen() {
  const router = useRouter();

  const helpItems = [
    {
      id: '1',
      title: 'How to accept orders?',
      icon: 'help-outline',
      description: 'Learn how to view and accept delivery orders',
    },
    {
      id: '2',
      title: 'Payment & Earnings',
      icon: 'account-balance-wallet',
      description: 'Understand how payments and withdrawals work',
    },
    {
      id: '3',
      title: 'Delivery Guidelines',
      icon: 'local-shipping',
      description: 'Best practices for successful deliveries',
    },
    {
      id: '4',
      title: 'Account Safety',
      icon: 'security',
      description: 'Keep your account secure',
    },
  ];

  const handleCall = () => {
    Linking.openURL('tel:+918800000000');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@drop.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/918800000000');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <View style={styles.contactIconContainer}>
                <MaterialIcons name="phone" size={24} color="#4CAF50" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Call Support</Text>
                <Text style={styles.contactValue}>+91 88000 00000</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
              <View style={styles.contactIconContainer}>
                <MaterialIcons name="chat" size={24} color="#25D366" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>Chat with us</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
              <View style={styles.contactIconContainer}>
                <MaterialIcons name="email" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@drop.com</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqSection}>
            {helpItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.faqCard}>
                <View style={styles.faqLeft}>
                  <View style={styles.faqIcon}>
                    <MaterialIcons name={item.icon as any} size={24} color="#FF6B6B" />
                  </View>
                  <View style={styles.faqInfo}>
                    <Text style={styles.faqTitle}>{item.title}</Text>
                    <Text style={styles.faqDescription}>{item.description}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Hours */}
        <View style={styles.section}>
          <View style={styles.hoursCard}>
            <MaterialIcons name="schedule" size={20} color="#666" />
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursLabel}>Support Hours</Text>
              <Text style={styles.hoursValue}>24/7 Available</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  faqSection: {
    paddingHorizontal: 16,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  faqLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faqInfo: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  faqDescription: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  hoursInfo: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
