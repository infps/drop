import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/use-auth';
import { useRider } from '../../hooks/use-rider';
import { formatPhoneNumber } from '../../utils/formatting';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { rider, isLoading, fetchProfile } = useRider();

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading && !rider) {
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            {(user?.name || rider?.name) ? (
              <Text style={styles.avatarText}>
                {(user?.name || rider?.name || 'R').charAt(0).toUpperCase()}
              </Text>
            ) : (
              <MaterialIcons name="person" size={40} color="#fff" />
            )}
          </View>
          <Text style={styles.name}>{user?.name || rider?.name || 'Rider'}</Text>
          <Text style={styles.phone}>
            {formatPhoneNumber(user?.phone || rider?.phone || '')}
          </Text>
        </View>

        {/* Stats Section */}
        {rider && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rider.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Text style={styles.statValue}>{rider.rating.toFixed(1)}</Text>
                <MaterialIcons name="star" size={20} color="#FFB800" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {rider.isOnline ? 'Online' : 'Offline'}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        )}

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/edit-profile')}
          >
            <MaterialIcons name="edit" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/vehicle-details')}
          >
            <MaterialIcons name="directions-car" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Vehicle Details</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/documents')}
          >
            <MaterialIcons name="description" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Documents</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Financial</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/bank-account')}
          >
            <MaterialIcons name="account-balance" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Bank Account</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/withdrawal-history')}
          >
            <MaterialIcons name="payment" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Withdrawal History</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>More</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/ratings-reviews')}
          >
            <MaterialIcons name="star" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Ratings & Reviews</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/settings')}
          >
            <MaterialIcons name="settings" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(profile)/help-support')}
          >
            <MaterialIcons name="help" size={20} color="#666" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
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
  statItem: {
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  menuSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
    paddingHorizontal: 12,
    marginLeft: -12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
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
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  bottomSpacing: {
    height: 20,
  },
});
