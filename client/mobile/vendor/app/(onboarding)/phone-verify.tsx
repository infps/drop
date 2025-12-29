import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { apiClient } from '../../services/api';
import { vendorService } from '../../services/vendor-service';

type Step = 'send' | 'verify';

export default function PhoneVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = (params.phone as string) || '';

  const [step, setStep] = useState<Step>('send');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (step !== 'verify' || timeLeft <= 0) {
      if (timeLeft <= 0) setCanResend(true);
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
  }, [step, timeLeft]);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Register vendor first (this also sends OTP)
      await vendorService.register({
        businessName: params.businessName as string,
        businessType: params.businessType as any,
        cuisineTypes: (params.cuisines as string)?.split(',').filter(Boolean) || [],
        description: params.description as string,
        ownerName: params.ownerName as string,
        phone: params.phone as string,
        alternatePhone: params.alternatePhone as string,
        email: params.email as string,
        gstNumber: params.gstNumber as string,
        fssaiNumber: params.fssaiNumber as string,
        panNumber: params.panNumber as string,
        bankAccount: params.bankAccount as string,
        ifscCode: params.ifscCode as string,
        address: params.address as string,
        city: params.city as string,
        pincode: params.pincode as string,
        landmark: params.landmark as string,
        latitude: 0,
        longitude: 0,
        openingTime: params.openingTime as string,
        closingTime: params.closingTime as string,
        avgPrepTime: parseInt(params.prepTime as string) || 30,
        minimumOrder: parseInt(params.minOrder as string) || 100,
        deliveryRadius: parseInt(params.deliveryRadius as string) || 5,
      });

      setStep('verify');
      setTimeLeft(300);
      setCanResend(false);
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 6) {
      setOtp(cleaned);
      if (cleaned.length === 6) {
        handleVerifyAndSubmit(cleaned);
      }
    }
  };

  const handleVerifyAndSubmit = async (otpCode: string) => {
    if (otpCode.length !== 6) return;

    try {
      setIsLoading(true);
      setError(null);

      // Verify OTP (this marks vendor as verified)
      await apiClient.post('/auth/verify-otp', { phone, otp: otpCode, type: 'vendor' });

      Alert.alert(
        'Application Submitted',
        'We will review your application and contact you within 24-48 hours.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
      setOtp('');
      otpInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await apiClient.post('/auth/send-otp', { phone, type: 'vendor' });
      setTimeLeft(300);
      setCanResend(false);
      setOtp('');
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('send');
      setOtp('');
      setError(null);
    } else {
      router.back();
    }
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
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.progress}>
            <View style={styles.progressDotDone} />
            <View style={styles.progressDotDone} />
            <View style={styles.progressDotDone} />
            <View style={styles.progressDotDone} />
            <View style={styles.progressDotDone} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
          </View>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {step === 'send' ? (
            <>
              <Text style={styles.title}>Verify Your Phone</Text>
              <Text style={styles.subtitle}>
                We'll send an OTP to verify your phone number
              </Text>

              <View style={styles.phoneDisplay}>
                <MaterialIcons name="phone" size={24} color="#FF6B6B" />
                <Text style={styles.phoneNumber}>{displayPhone}</Text>
              </View>

              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, !isLoading && styles.buttonActive]}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to {displayPhone}
              </Text>

              <View style={styles.formGroup}>
                <TextInput
                  ref={otpInputRef}
                  style={styles.otpInput}
                  placeholder="000000"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={handleOtpChange}
                  editable={!isLoading}
                  textAlign="center"
                />
              </View>

              <View style={styles.timerSection}>
                <Text style={styles.timerLabel}>OTP expires in</Text>
                <Text style={[styles.timer, timeLeft < 60 && styles.timerWarning]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>

              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

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

              <TouchableOpacity
                style={[
                  styles.button,
                  otp.length === 6 && !isLoading
                    ? styles.buttonActive
                    : styles.buttonDisabled,
                ]}
                onPress={() => handleVerifyAndSubmit(otp)}
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Submit</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  progressDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  progressDotActive: {
    backgroundColor: '#FF6B6B',
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  phoneDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    gap: 12,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  formGroup: {
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    height: 60,
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    backgroundColor: '#fff',
    letterSpacing: 8,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
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
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#999',
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
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
