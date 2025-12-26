import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="order-detail" options={{ title: 'Order Details' }} />
      <Stack.Screen name="add-menu-item" options={{ title: 'Add Menu Item' }} />
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
