import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/theme';
import { useRider } from '../../hooks/use-rider';
import { riderService } from '../../services/rider-service';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { rider } = useRider();

  const [vehicleType, setVehicleType] = useState('BIKE');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update fields when rider data loads
  useEffect(() => {
    if (rider) {
      setVehicleType(rider.vehicleType || 'BIKE');
      setVehicleNumber(rider.vehicleNumber || '');
      setVehicleModel(rider.vehicleModel || '');
      setVehicleColor(rider.vehicleColor || '');
    }
  }, [rider]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Update rider profile with vehicle details
      await riderService.updateProfile({
        vehicleType,
        vehicleNumber,
        vehicleModel,
        vehicleColor,
      });

      Alert.alert('Success', 'Vehicle details updated successfully');
      router.back();
    } catch (error: any) {
      console.error('Failed to save vehicle details:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update vehicle details. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vehicle Icon */}
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="directions-car" size={48} color="#FF6B6B" />
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.vehicleTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  vehicleType === 'BIKE' && styles.typeButtonActive
                ]}
                onPress={() => setVehicleType('BIKE')}
              >
                <MaterialIcons
                  name="two-wheeler"
                  size={24}
                  color={vehicleType === 'BIKE' ? '#fff' : '#666'}
                />
                <Text style={[
                  styles.typeButtonText,
                  vehicleType === 'BIKE' && styles.typeButtonTextActive
                ]}>
                  Bike
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  vehicleType === 'CAR' && styles.typeButtonActive
                ]}
                onPress={() => setVehicleType('CAR')}
              >
                <MaterialIcons
                  name="directions-car"
                  size={24}
                  color={vehicleType === 'CAR' ? '#fff' : '#666'}
                />
                <Text style={[
                  styles.typeButtonText,
                  vehicleType === 'CAR' && styles.typeButtonTextActive
                ]}>
                  Car
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Number</Text>
            <TextInput
              style={styles.input}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholder="e.g., KA01AB1234"
              placeholderTextColor="#ccc"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Model</Text>
            <TextInput
              style={styles.input}
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="e.g., Honda Activa 6G"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Color</Text>
            <TextInput
              style={styles.input}
              value={vehicleColor}
              onChangeText={setVehicleColor}
              placeholder="e.g., Black"
              placeholderTextColor="#ccc"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
