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

export default function RMSLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: () => <BackButton />,
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
