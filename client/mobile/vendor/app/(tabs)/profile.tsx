import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../hooks/use-auth';
import { useVendor } from '../../hooks/use-vendor';
import { formatRating } from '../../utils/formatting';

interface MenuItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  color?: string;
}

const MenuItem = ({ icon, label, value, onPress, color = '#666' }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <MaterialIcons name={icon as any} size={24} color={color} />
      <Text style={[styles.menuItemLabel, color !== '#666' && { color }]}>
        {label}
      </Text>
    </View>
    <View style={styles.menuItemRight}>
      {value && <Text style={styles.menuItemValue}>{value}</Text>}
      <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { vendor, fetchProfile } = useVendor();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="store" size={40} color="#FF6B6B" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.storeName}>{vendor?.name || 'Your Store'}</Text>
            <Text style={styles.storeType}>{vendor?.type || 'Restaurant'}</Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {formatRating(vendor?.rating || 0)} ({vendor?.totalRatings || 0} reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/(screens)/edit-profile')}
          >
            <MaterialIcons name="edit" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Management</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="store"
              label="Store Information"
              onPress={() => router.push('/(screens)/edit-profile')}
            />
            <MenuItem
              icon="access-time"
              label="Business Hours"
              onPress={() => router.push('/(screens)/settings')}
            />
            <MenuItem
              icon="delivery-dining"
              label="Delivery Settings"
              onPress={() => router.push('/(screens)/settings')}
            />
            <MenuItem
              icon="table-restaurant"
              label="Dine-In Management"
              onPress={() => router.push('/(rms)/dashboard')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments & Documents</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="account-balance"
              label="Bank Details"
              onPress={() => router.push('/(screens)/bank-details')}
            />
            <MenuItem
              icon="description"
              label="Documents"
              onPress={() => router.push('/(screens)/documents')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="analytics"
              label="Analytics"
              onPress={() => router.push('/(screens)/analytics')}
            />
            <MenuItem
              icon="rate-review"
              label="Reviews"
              onPress={() => router.push('/(screens)/reviews')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help"
              label="Help & Support"
              onPress={() => {}}
            />
            <MenuItem
              icon="policy"
              label="Terms & Policies"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="logout"
              label="Logout"
              onPress={handleLogout}
              color="#E53935"
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  storeType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemValue: {
    fontSize: 14,
    color: '#999',
  },
  bottomSpacing: {
    height: 100,
  },
});
