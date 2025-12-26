import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMenu } from '../../hooks/use-menu';

export default function EditMenuItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, currentItem, fetchCategories, fetchMenuItem, updateMenuItem, isLoading } = useMenu();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [prepTime, setPrepTime] = useState('');

  const loadData = useCallback(async () => {
    await fetchCategories();
    if (id) {
      const item = await fetchMenuItem(id);
      if (item) {
        setName(item.name);
        setDescription(item.description || '');
        setCategoryId(item.categoryId);
        setPrice(item.price.toString());
        setDiscountPrice(item.discountPrice?.toString() || '');
        setIsVeg(item.isVeg);
        setInStock(item.inStock);
        setPrepTime(item.prepTime?.toString() || '');
      }
    }
  }, [id, fetchCategories, fetchMenuItem]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async () => {
    if (!name || !categoryId || !price || !id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await updateMenuItem({
        id,
        name,
        description,
        categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        isVeg,
        inStock,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
      });
      Alert.alert('Success', 'Menu item updated successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update menu item');
    }
  };

  const isValid = name && categoryId && price;

  if (!currentItem && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  categoryId === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    categoryId === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Discount Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={discountPrice}
              onChangeText={setDiscountPrice}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prep Time (mins)</Text>
          <TextInput
            style={styles.input}
            placeholder="15"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={prepTime}
            onChangeText={setPrepTime}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Vegetarian</Text>
            <Text style={styles.toggleDescription}>Mark as veg item</Text>
          </View>
          <Switch
            value={isVeg}
            onValueChange={setIsVeg}
            trackColor={{ false: '#ddd', true: '#4CAF50' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>In Stock</Text>
            <Text style={styles.toggleDescription}>Item availability</Text>
          </View>
          <Switch
            value={inStock}
            onValueChange={setInStock}
            trackColor={{ false: '#ddd', true: '#FF6B6B' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, (!isValid || isLoading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
  },
  textArea: {
    height: 80,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryChipActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleInfo: {},
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  toggleDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    padding: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
});
