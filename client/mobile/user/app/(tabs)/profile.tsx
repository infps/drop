import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '../../hooks/use-auth'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const menuItems = [
    {
      title: 'Account',
      items: [
        { icon: 'location-on', label: 'Saved Addresses', route: '/addresses' },
        { icon: 'payment', label: 'Payment Methods', route: '/payments' },
        { icon: 'favorite', label: 'Favorites', route: '/favorites' },
      ],
    },
    {
      title: 'Wallet & Rewards',
      items: [
        { icon: 'account-balance-wallet', label: 'Wallet', route: '/wallet' },
        { icon: 'stars', label: 'Loyalty Points', route: '/loyalty' },
        { icon: 'card-giftcard', label: 'Referral Program', route: '/referral' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', route: '/help' },
        { icon: 'description', label: 'Terms & Conditions', route: '/terms' },
        { icon: 'privacy-tip', label: 'Privacy Policy', route: '/privacy' },
      ],
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={40} color="#fff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userPhone}>{user?.phone || ''}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => {
                    // router.push(item.route)
                    Alert.alert('Coming Soon', `${item.label} feature is under development`)
                  }}
                >
                  <MaterialIcons name={item.icon as any} size={24} color="#FF6B6B" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>DROP v2.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  userPhone: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  version: {
    fontSize: 12,
    color: '#8E8E93',
  },
})
