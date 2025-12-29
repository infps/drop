import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { VENDOR_TYPES, CUISINE_TYPES } from '../../utils/constants';

export default function BusinessInfoScreen() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const fillTest = () => {
    setBusinessName('Test Restaurant');
    setBusinessType('RESTAURANT');
    setSelectedCuisines(['North Indian', 'Chinese']);
    setDescription('A test restaurant for development');
  };

  const handleNext = () => {
    router.push({
      pathname: '/(onboarding)/owner-details',
      params: {
        businessName,
        businessType,
        cuisines: selectedCuisines.join(','),
        description,
      },
    });
  };

  const isValid = businessName && businessType;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Business Information</Text>
            <Text style={styles.subtitle}>Tell us about your store</Text>
          </View>
          {__DEV__ && (
            <TouchableOpacity style={styles.fillTestBtn} onPress={fillTest}>
              <Text style={styles.fillTestText}>Fill Test</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your business name"
            placeholderTextColor="#999"
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Business Type *</Text>
          <View style={styles.typeGrid}>
            {VENDOR_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeCard,
                  businessType === type.value && styles.typeCardActive,
                ]}
                onPress={() => setBusinessType(type.value)}
              >
                <Text
                  style={[
                    styles.typeText,
                    businessType === type.value && styles.typeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {businessType === 'RESTAURANT' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cuisine Types</Text>
            <View style={styles.cuisineGrid}>
              {CUISINE_TYPES.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.cuisineChip,
                    selectedCuisines.includes(cuisine) && styles.cuisineChipActive,
                  ]}
                  onPress={() => handleCuisineToggle(cuisine)}
                >
                  <Text
                    style={[
                      styles.cuisineText,
                      selectedCuisines.includes(cuisine) &&
                        styles.cuisineTextActive,
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your business..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  fillTestBtn: {
    backgroundColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  fillTestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    letterSpacing: 0,
  },
  textArea: {
    height: 100,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  typeCardActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE5E5',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  typeTextActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  cuisineChipActive: {
    backgroundColor: '#FF6B6B',
  },
  cuisineText: {
    fontSize: 13,
    color: '#666',
  },
  cuisineTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  nextBtnDisabled: {
    backgroundColor: '#ccc',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
