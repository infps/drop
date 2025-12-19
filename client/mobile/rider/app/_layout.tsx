import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { AuthProvider } from '../context/auth-context';
import { useAuth } from '../hooks/use-auth';

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen
          name="(tabs)"
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="(auth)"
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </Stack>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
