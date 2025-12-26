import { Stack } from 'expo-router';

export default function RMSLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: 'Restaurant Management' }} />
      <Stack.Screen name="tables" options={{ title: 'Tables' }} />
      <Stack.Screen name="reservations" options={{ title: 'Reservations' }} />
      <Stack.Screen name="waitlist" options={{ title: 'Waitlist' }} />
      <Stack.Screen name="kds" options={{ title: 'Kitchen Display' }} />
      <Stack.Screen name="pos" options={{ title: 'Point of Sale' }} />
      <Stack.Screen name="guests" options={{ title: 'Guests' }} />
      <Stack.Screen name="staff" options={{ title: 'Staff' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
    </Stack>
  );
}
