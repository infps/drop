import React, { useState, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMenu } from '../../hooks/use-menu';
import { DishImagePicker } from '../../components/DishImagePicker';

export default function AddMenuItemScreen() {
  const router = useRouter();
  const { categories, fetchCategories, createMenuItem, createCategory, isLoading } = useMenu();

  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [prepTime, setPrepTime] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const cat = await createCategory({ name: newCategoryName.trim() });
      setCategoryId(cat.id);
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create category');
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (images.length === 0) {
      newErrors.images = 'At least one dish image is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!categoryId) {
      newErrors.category = 'Please select a category';
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (discountPrice && parseFloat(discountPrice) >= parseFloat(price)) {
      newErrors.discountPrice = 'Discount must be less than price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again');
      return;
    }

    try {
      await createMenuItem({
        name: name.trim(),
        description: description.trim() || undefined,
        categoryId,
        images,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        isVeg,
        inStock,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
      });
      Alert.alert('Success', 'Menu item added successfully');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add menu item');
    }
  };

  const isValid = images.length > 0 && name && categoryId && price;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* IMAGE PICKER - FIRST AND PROMINENT */}
        <DishImagePicker
          images={images}
          onChange={setImages}
          required
          error={errors.images}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter item name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((e) => ({ ...e, name: '' }));
            }}
          />
          {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
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
            {categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  categoryId === cat.id && styles.categoryChipActive,
                  errors.category && !categoryId && styles.categoryChipError,
                ]}
                onPress={() => {
                  setCategoryId(cat.id);
                  if (errors.category) setErrors((e) => ({ ...e, category: '' }));
                }}
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
            <TouchableOpacity
              style={styles.addCategoryChip}
              onPress={() => setShowAddCategory(true)}
            >
              <MaterialIcons name="add" size={18} color="#FF6B6B" />
              <Text style={styles.addCategoryText}>Add</Text>
            </TouchableOpacity>
          </View>
          {errors.category && <Text style={styles.fieldError}>{errors.category}</Text>}
          {showAddCategory && (
            <View style={styles.addCategoryRow}>
              <TextInput
                style={styles.addCategoryInput}
                placeholder="Category name"
                placeholderTextColor="#999"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <TouchableOpacity style={styles.addCategoryBtn} onPress={handleAddCategory}>
                <MaterialIcons name="check" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelCategoryBtn}
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
              >
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (errors.price) setErrors((e) => ({ ...e, price: '' }));
              }}
            />
            {errors.price && <Text style={styles.fieldError}>{errors.price}</Text>}
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Discount Price (₹)</Text>
            <TextInput
              style={[styles.input, errors.discountPrice && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={discountPrice}
              onChangeText={(text) => {
                setDiscountPrice(text);
                if (errors.discountPrice) setErrors((e) => ({ ...e, discountPrice: '' }));
              }}
            />
            {errors.discountPrice && <Text style={styles.fieldError}>{errors.discountPrice}</Text>}
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
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Add Item</Text>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    letterSpacing: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#e53935',
  },
  fieldError: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryChipActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryChipError: {
    borderWidth: 1,
    borderColor: '#e53935',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
    gap: 4,
  },
  addCategoryText: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  addCategoryBtn: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 10,
  },
  cancelCategoryBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
