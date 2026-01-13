import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../hooks/use-auth'
import { Colors } from '../../constants/theme'

export default function VerifyOtpScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { verifyOtp, sendOtp, isLoading, error } = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef<Array<TextInput | null>>([])

  const phone = params.phone as string

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    // Auto-verify if all 6 digits entered
    if (newOtp.every((digit) => digit !== '') && !value) {
      // Slight delay to show the last digit
      setTimeout(() => handleVerify(newOtp.join('')), 100)
    }
  }

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('')
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP')
      return
    }

    try {
      await verifyOtp(phone, code)
      router.replace('/(tabs)/home')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP')
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return

    try {
      await sendOtp(phone)
      setResendTimer(30)
      Alert.alert('Success', 'OTP sent successfully')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP')
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {'\n'}
              <Text style={styles.phone}>{phone}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                otp.every((d) => d !== '') && !isLoading
                  ? styles.buttonActive
                  : styles.buttonDisabled,
              ]}
              onPress={() => handleVerify()}
              disabled={!otp.every((d) => d !== '') || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendSection}>
              <Text style={styles.resendLabel}>Didn't receive OTP?</Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendTimer > 0 || isLoading}
              >
                <Text
                  style={[
                    styles.resendText,
                    (resendTimer > 0 || isLoading) && styles.resendDisabled,
                  ]}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Having trouble? Contact our support team for assistance
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  phone: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  form: {
    flex: 1,
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#C00',
    fontSize: 14,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    backgroundColor: '#fff',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonActive: {
    backgroundColor: '#FF6B6B',
  },
  buttonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  resendLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  resendText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  resendDisabled: {
    color: Colors.light.tabIconDefault,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
})
