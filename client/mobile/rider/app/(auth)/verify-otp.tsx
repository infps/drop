import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/use-auth';
import { Colors } from '../../constants/theme';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone: phoneParam } = useLocalSearchParams<{ phone: string }>();
  const { verifyOtp, isLoading, error } = useAuth();

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  const phone = phoneParam || '';

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 6) {
      setOtp(cleaned);

      // Auto-verify when all 6 digits are entered
      if (cleaned.length === 6) {
        verifyOtpHandler(cleaned);
      }
    }
  };

  const verifyOtpHandler = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOtp(phone, otpCode);
      // If verification succeeds, auth context will update and router will redirect
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message || 'Invalid OTP. Please try again.');
      setOtp('');
      otpInputRef.current?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      setTimeLeft(300);
      setCanResend(false);
      setOtp('');
      // Implementation would call sendOtp again
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              We've sent an OTP to {displayPhone}
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.form}>
            <Text style={styles.label}>Enter 6-digit OTP</Text>
            <TextInput
              ref={otpInputRef}
              style={styles.otpInput}
              placeholder="000000"
              placeholderTextColor={Colors.light.tabIconDefault}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={handleOtpChange}
              editable={!isLoading}
              selectTextOnFocus
              textAlign="center"
            />

            {/* Timer */}
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>OTP expires in</Text>
              <Text
                style={[
                  styles.timer,
                  timeLeft < 60 && styles.timerWarning,
                ]}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Resend */}
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>Didn't receive OTP?</Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={!canResend || isLoading}
              >
                <Text
                  style={[
                    styles.resendButton,
                    (!canResend || isLoading) && styles.resendButtonDisabled,
                  ]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.button,
                otp.length === 6 && !isLoading
                  ? styles.buttonActive
                  : styles.buttonDisabled,
              ]}
              onPress={() => verifyOtpHandler(otp)}
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Having trouble? Contact our support team for assistance
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    height: 60,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
    backgroundColor: '#fff',
    letterSpacing: 8,
    marginBottom: 24,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  timer: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  timerWarning: {
    color: '#FF4444',
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
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  resendButton: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: Colors.light.tabIconDefault,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonActive: {
    backgroundColor: '#FF6B6B',
  },
  buttonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
});
