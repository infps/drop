import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Beverages', 'Desserts'];

const MENU_ITEMS = [
  { id: '1', name: 'Chicken Biryani', price: 320, category: 'Main Course' },
  { id: '2', name: 'Butter Naan', price: 45, category: 'Breads' },
  { id: '3', name: 'Paneer Tikka', price: 280, category: 'Starters' },
  { id: '4', name: 'Dal Makhani', price: 220, category: 'Main Course' },
  { id: '5', name: 'Jeera Rice', price: 150, category: 'Main Course' },
  { id: '6', name: 'Gulab Jamun', price: 80, category: 'Desserts' },
  { id: '7', name: 'Masala Chai', price: 40, category: 'Beverages' },
  { id: '8', name: 'Garlic Naan', price: 55, category: 'Breads' },
];

export default function POSScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : c;
      }
      return c;
    }).filter(c => c.qty > 0));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const clearCart = () => {
    setCart([]);
    setTableNumber('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuSection}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.menuList}>
          <View style={styles.menuGrid}>
            {filteredItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuCard} onPress={() => addToCart(item)}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                <View style={styles.addIcon}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.cartSection}>
        <View style={styles.cartHeader}>
          <View style={styles.tableInput}>
            <MaterialIcons name="table-restaurant" size={20} color="#666" />
            <TextInput
              style={styles.tableInputField}
              placeholder="Table #"
              value={tableNumber}
              onChangeText={setTableNumber}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity onPress={clearCart}>
            <MaterialIcons name="delete-outline" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <MaterialIcons name="shopping-cart" size={48} color="#ddd" />
              <Text style={styles.emptyCartText}>Cart is empty</Text>
            </View>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>₹{item.price * item.qty}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                    <MaterialIcons name="remove" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                    <MaterialIcons name="add" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {cart.length > 0 && (
          <View style={styles.cartFooter}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{tax}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>

            <View style={styles.paymentBtns}>
              <TouchableOpacity style={[styles.payBtn, styles.payBtnCash]}>
                <MaterialIcons name="payments" size={20} color="#fff" />
                <Text style={styles.payBtnText}>Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.payBtn, styles.payBtnCard]}>
                <MaterialIcons name="credit-card" size={20} color="#fff" />
                <Text style={styles.payBtnText}>Card</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.payBtn, styles.payBtnUpi]}>
                <MaterialIcons name="qr-code" size={20} color="#fff" />
                <Text style={styles.payBtnText}>UPI</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.printBtn}>
              <MaterialIcons name="print" size={20} color="#FF6B6B" />
              <Text style={styles.printBtnText}>Print KOT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#f5f5f5' },
  menuSection: { flex: 1, backgroundColor: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, gap: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  categoryBar: { flexGrow: 0, paddingHorizontal: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  categoryChipActive: { backgroundColor: '#FF6B6B' },
  categoryText: { fontSize: 14, color: '#666' },
  categoryTextActive: { color: '#fff', fontWeight: '600' },
  menuList: { flex: 1, padding: 16 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuCard: {
    width: '47%', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#f0f0f0',
  },
  menuItemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  menuItemPrice: { fontSize: 16, fontWeight: '700', color: '#FF6B6B', marginTop: 8 },
  addIcon: { position: 'absolute', right: 8, bottom: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
  cartSection: {
    width: 320, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#f0f0f0',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: -2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  cartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tableInput: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  tableInputField: { flex: 1, fontSize: 16, color: '#333' },
  cartList: { flex: 1, padding: 16 },
  emptyCart: { alignItems: 'center', paddingVertical: 48 },
  emptyCartText: { fontSize: 14, color: '#999', marginTop: 8 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '500', color: '#333' },
  cartItemPrice: { fontSize: 14, color: '#666', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: 16, fontWeight: '600', color: '#333', minWidth: 24, textAlign: 'center' },
  cartFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  paymentBtns: { flexDirection: 'row', gap: 8, marginTop: 16 },
  payBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 8 },
  payBtnCash: { backgroundColor: '#4CAF50' },
  payBtnCard: { backgroundColor: '#2196F3' },
  payBtnUpi: { backgroundColor: '#9C27B0' },
  payBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  printBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, paddingVertical: 12, borderWidth: 2, borderColor: '#FF6B6B', borderRadius: 8 },
  printBtnText: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
});
