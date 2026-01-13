import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '../hooks/use-auth'
import { Colors } from '../constants/theme'

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.light.background }]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />
  }

  return <Redirect href="/(auth)/login" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
