import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
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
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Rider'}</Text>
          <Text style={styles.phone}>
            {user?.phone ? formatPhoneNumber(user.phone) : 'No phone'}
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
              <Text style={styles.statValue}>{rider.rating.toFixed(1)}⭐</Text>
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
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🚗</Text>
            <Text style={styles.menuText}>Vehicle Details</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Documents</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Financial</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🏦</Text>
            <Text style={styles.menuText}>Bank Account</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>💸</Text>
            <Text style={styles.menuText}>Withdrawal History</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>More</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⭐</Text>
            <Text style={styles.menuText}>Ratings & Reviews</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuText}>Help & Support</Text>
            <Text style={styles.menuArrow}>›</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  menuArrow: {
    fontSize: 18,
    color: Colors.light.tabIconDefault,
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
