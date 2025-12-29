import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
      <MaterialIcons name="arrow-back" size={24} color="#333" />
    </TouchableOpacity>
  );
}

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="order-detail" options={{ title: 'Order Details' }} />
      <Stack.Screen
        name="add-menu-item"
        options={{
          title: 'Add Menu Item',
          headerStyle: { backgroundColor: '#f5f5f5' },
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen name="edit-menu-item" options={{ title: 'Edit Menu Item' }} />
      <Stack.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Stack.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="bank-details" options={{ title: 'Bank Details' }} />
      <Stack.Screen name="documents" options={{ title: 'Documents' }} />
    </Stack>
  );
}
