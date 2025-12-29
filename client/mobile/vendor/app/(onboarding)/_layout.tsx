import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="business-info" />
      <Stack.Screen name="owner-details" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="store-setup" />
      <Stack.Screen name="review" />
      <Stack.Screen name="phone-verify" />
    </Stack>
  );
}
