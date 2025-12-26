import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Switch,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMenu } from '../../hooks/use-menu';
import { MenuItem, Category } from '../../types';
import { formatCurrency } from '../../utils/formatting';

export default function MenuScreen() {
  const router = useRouter();
  const {
    items,
    categories,
    fetchMenu,
    toggleAvailability,
    deleteMenuItem,
    isLoading,
  } = useMenu();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadMenu = useCallback(async () => {
    await fetchMenu({
      category: selectedCategory || undefined,
      search: searchQuery || undefined,
    });
  }, [fetchMenu, selectedCategory, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadMenu();
    }, [loadMenu])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMenu();
    setRefreshing(false);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    setActionLoading(item.id);
    try {
      await toggleAvailability(item.id, !item.inStock);
    } catch (err) {
      console.error('Failed to toggle:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(item.id);
            try {
              await deleteMenuItem(item.id);
            } catch (err) {
              console.error('Failed to delete:', err);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActionLoading = actionLoading === item.id;

    return (
      <View key={item.id} style={styles.menuItem}>
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <View style={styles.vegIndicator}>
              <View
                style={[
                  styles.vegDot,
                  { backgroundColor: item.isVeg ? '#4CAF50' : '#E53935' },
                ]}
              />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            {item.discountPrice && (
              <Text style={styles.discountPrice}>
                {formatCurrency(item.discountPrice)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.itemActions}>
          {isActionLoading ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <>
              <Switch
                value={item.inStock}
                onValueChange={() => handleToggleAvailability(item)}
                trackColor={{ false: '#ddd', true: '#FF6B6B' }}
                thumbColor="#fff"
              />
              <View style={styles.itemButtons}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    router.push(`/(screens)/edit-menu-item?id=${item.id}`)
                  }
                >
                  <MaterialIcons name="edit" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDelete(item)}
                >
                  <MaterialIcons name="delete" size={20} color="#E53935" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(screens)/add-menu-item')}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={loadMenu}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.categoryTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.menuList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B6B"
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="restaurant-menu" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No menu items found</Text>
            <TouchableOpacity
              style={styles.addItemBtn}
              onPress={() => router.push('/(screens)/add-menu-item')}
            >
              <Text style={styles.addItemBtnText}>Add your first item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map(renderMenuItem)
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  menuList: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  addItemBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  addItemBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  discountPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});
