import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/use-auth";
import { Colors } from "../../constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { sendOtp, isLoading, error } = useAuth();

  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length <= 10) {
      setPhone(cleaned);
      setIsValid(cleaned.length === 10);
    }
  };

  const handleContinue = async () => {
    if (!isValid) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number",
      );
      return;
    }

    try {
      await sendOtp(phone);
      // Navigate to OTP verification
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { phone },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send OTP");
    }
  };

  const displayPhone =
    phone.length > 0 ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🚲 Drop</Text>
          <Text style={styles.title}>Rider App</Text>
          <Text style={styles.subtitle}>Start earning with your vehicle</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor={Colors.light.tabIconDefault}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={handlePhoneChange}
                editable={!isLoading}
              />
            </View>
            {phone.length > 0 && (
              <Text style={styles.displayPhone}>{displayPhone}</Text>
            )}
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              isValid && !isLoading
                ? styles.buttonActive
                : styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New to Drop? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportText}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 60,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.light.text,
  },
  displayPhone: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginTop: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  buttonActive: {
    backgroundColor: "#FF6B6B",
  },
  buttonDisabled: {
    backgroundColor: Colors.light.tabIconDefault,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  errorBanner: {
    backgroundColor: "#FFE5E5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: "#C00",
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  link: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  supportButton: {
    paddingVertical: 8,
  },
  supportText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  registerLink: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
});
