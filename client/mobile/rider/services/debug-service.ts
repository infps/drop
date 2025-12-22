import { apiClient } from './api';

export const debugService = {
  async checkToken() {
    try {
      const response = await apiClient.get('/auth/debug/token');
      console.log('🔍 Token Debug Info:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Debug error:', error);
      throw error;
    }
  },
};
