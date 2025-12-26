import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrder?: string;
  guestName?: string;
  occupiedSince?: string;
}

const MOCK_TABLES: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available' },
  { id: '2', number: 2, capacity: 4, status: 'occupied', currentOrder: '#1234', guestName: 'John D.', occupiedSince: '12:30 PM' },
  { id: '3', number: 3, capacity: 4, status: 'occupied', currentOrder: '#1235', guestName: 'Sarah M.', occupiedSince: '1:15 PM' },
  { id: '4', number: 4, capacity: 6, status: 'reserved', guestName: 'Mike R.' },
  { id: '5', number: 5, capacity: 2, status: 'billing', currentOrder: '#1230', guestName: 'Lisa K.', occupiedSince: '11:45 AM' },
  { id: '6', number: 6, capacity: 4, status: 'available' },
  { id: '7', number: 7, capacity: 8, status: 'occupied', currentOrder: '#1236', guestName: 'Party', occupiedSince: '12:00 PM' },
  { id: '8', number: 8, capacity: 2, status: 'billing', currentOrder: '#1231', guestName: 'Tom B.', occupiedSince: '12:15 PM' },
];

const STATUS_CONFIG: Record<TableStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#4CAF50', bg: '#E8F5E9' },
  occupied: { label: 'Occupied', color: '#2196F3', bg: '#E3F2FD' },
  reserved: { label: 'Reserved', color: '#9C27B0', bg: '#F3E5F5' },
  billing: { label: 'Billing', color: '#FFA726', bg: '#FFF3E0' },
};

export default function TablesScreen() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [filter, setFilter] = useState<TableStatus | 'all'>('all');

  const filteredTables = filter === 'all' ? MOCK_TABLES : MOCK_TABLES.filter(t => t.status === filter);

  const statusCounts = {
    all: MOCK_TABLES.length,
    available: MOCK_TABLES.filter(t => t.status === 'available').length,
    occupied: MOCK_TABLES.filter(t => t.status === 'occupied').length,
    reserved: MOCK_TABLES.filter(t => t.status === 'reserved').length,
    billing: MOCK_TABLES.filter(t => t.status === 'billing').length,
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {(['all', 'available', 'occupied', 'reserved', 'billing'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.filterChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status === 'all' ? 'All' : STATUS_CONFIG[status].label} ({statusCounts[status]})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredTables.map((table) => {
          const config = STATUS_CONFIG[table.status];
          return (
            <TouchableOpacity
              key={table.id}
              style={styles.tableCard}
              onPress={() => setSelectedTable(table)}
            >
              <View style={styles.tableHeader}>
                <View style={styles.tableNumberBox}>
                  <Text style={styles.tableNumber}>{table.number}</Text>
                </View>
                <View style={styles.tableInfo}>
                  <Text style={styles.tableLabel}>Table {table.number}</Text>
                  <Text style={styles.tableCapacity}>{table.capacity} seats</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                  <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                </View>
              </View>
              {table.guestName && (
                <View style={styles.tableDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="person" size={16} color="#666" />
                    <Text style={styles.detailText}>{table.guestName}</Text>
                  </View>
                  {table.currentOrder && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="receipt" size={16} color="#666" />
                      <Text style={styles.detailText}>{table.currentOrder}</Text>
                    </View>
                  )}
                  {table.occupiedSince && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="schedule" size={16} color="#666" />
                      <Text style={styles.detailText}>Since {table.occupiedSince}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal visible={!!selectedTable} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Table {selectedTable?.number}</Text>
              <TouchableOpacity onPress={() => setSelectedTable(null)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              {selectedTable?.status === 'available' && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="person-add" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Seat Guest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
                    <MaterialIcons name="event" size={20} color="#FF6B6B" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Reserve</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedTable?.status === 'occupied' && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="receipt" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>View Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
                    <MaterialIcons name="payments" size={20} color="#FF6B6B" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Generate Bill</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedTable?.status === 'billing' && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Mark Paid</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
                    <MaterialIcons name="print" size={20} color="#FF6B6B" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Print Bill</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedTable?.status === 'reserved' && (
                <>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="person-add" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Check In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
                    <MaterialIcons name="cancel" size={20} color="#FF6B6B" />
                    <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterBar: { flexGrow: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  filterChipActive: { backgroundColor: '#FF6B6B' },
  filterText: { fontSize: 14, color: '#666' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  tableCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  tableHeader: { flexDirection: 'row', alignItems: 'center' },
  tableNumberBox: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  tableNumber: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  tableInfo: { flex: 1, marginLeft: 12 },
  tableLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  tableCapacity: { fontSize: 13, color: '#666', marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  tableDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: '#666' },
  bottomSpacing: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  modalActions: { gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FF6B6B', borderRadius: 12, paddingVertical: 14 },
  actionBtnSecondary: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#FF6B6B' },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  actionBtnTextSecondary: { color: '#FF6B6B' },
});
