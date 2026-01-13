import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  TOKEN: '@drop_token',
  USER: '@drop_user',
}

export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.TOKEN)
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.TOKEN, token)
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.TOKEN)
  },

  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem(KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user))
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER)
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER])
  },
}
