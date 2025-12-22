import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/use-auth';
import { Colors } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'bike',
    vehicleNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.vehicleType) {
      Alert.alert('Error', 'Please select a vehicle type');
      return;
    }
    if (!formData.vehicleNumber.trim()) {
      Alert.alert('Error', 'Please enter vehicle number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/rider-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          vehicleType: formData.vehicleType.toUpperCase(),
          vehicleNumber: formData.vehicleNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token and navigate to home
      Alert.alert('Success', 'Registration successful! Welcome to Drop Rider!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message || 'Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🚲 Drop</Text>
            <Text style={styles.title}>Rider Registration</Text>
            <Text style={styles.subtitle}>Join our delivery network</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!isSubmitting}
              />
            </View>

            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.phoneInput}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, styles.phoneInputField]}
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/\D/g, '').slice(0, 10);
                    handleInputChange('phone', cleaned);
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>

            {/* Vehicle Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Type *</Text>
              <View style={styles.vehicleOptions}>
                {['bike', 'scooter', 'car', 'bicycle'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.vehicleOption,
                      formData.vehicleType === type && styles.vehicleOptionSelected,
                    ]}
                    onPress={() => handleInputChange('vehicleType', type)}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.vehicleOptionText,
                        formData.vehicleType === type && styles.vehicleOptionTextSelected,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vehicle Number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., MH-01-AB-1234"
                value={formData.vehicleNumber}
                onChangeText={(value) => handleInputChange('vehicleNumber', value.toUpperCase())}
                editable={!isSubmitting}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isSubmitting}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  form: {
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    backgroundColor: '#f5f5f5',
  },
  phoneInputField: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  vehicleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  vehicleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  vehicleOptionSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE5E5',
  },
  vehicleOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.tabIconDefault,
  },
  vehicleOptionTextSelected: {
    color: '#FF6B6B',
  },
  registerButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});
