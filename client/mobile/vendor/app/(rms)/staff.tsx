import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Switch } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type StaffRole = 'manager' | 'chef' | 'waiter' | 'cashier' | 'kitchen';
type ShiftStatus = 'on-duty' | 'off-duty' | 'break';

interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  status: ShiftStatus;
  shiftStart?: string;
  shiftEnd?: string;
  tablesAssigned?: number[];
}

const MOCK_STAFF: Staff[] = [
  { id: '1', name: 'Rahul Kumar', role: 'manager', phone: '+91 98765 43230', status: 'on-duty', shiftStart: '10:00 AM', shiftEnd: '7:00 PM' },
  { id: '2', name: 'Priya Singh', role: 'chef', phone: '+91 98765 43231', status: 'on-duty', shiftStart: '9:00 AM', shiftEnd: '5:00 PM' },
  { id: '3', name: 'Amit Sharma', role: 'waiter', phone: '+91 98765 43232', status: 'on-duty', shiftStart: '11:00 AM', shiftEnd: '8:00 PM', tablesAssigned: [1, 2, 3, 4] },
  { id: '4', name: 'Neha Patel', role: 'waiter', phone: '+91 98765 43233', status: 'break', shiftStart: '11:00 AM', shiftEnd: '8:00 PM', tablesAssigned: [5, 6, 7, 8] },
  { id: '5', name: 'Vikram Joshi', role: 'cashier', phone: '+91 98765 43234', status: 'on-duty', shiftStart: '10:00 AM', shiftEnd: '6:00 PM' },
  { id: '6', name: 'Sunita Devi', role: 'kitchen', phone: '+91 98765 43235', status: 'on-duty', shiftStart: '8:00 AM', shiftEnd: '4:00 PM' },
  { id: '7', name: 'Kiran Rao', role: 'waiter', phone: '+91 98765 43236', status: 'off-duty' },
];

const ROLE_CONFIG: Record<StaffRole, { label: string; icon: string; color: string }> = {
  manager: { label: 'Manager', icon: 'supervisor-account', color: '#9C27B0' },
  chef: { label: 'Chef', icon: 'restaurant', color: '#FF6B6B' },
  waiter: { label: 'Waiter', icon: 'room-service', color: '#2196F3' },
  cashier: { label: 'Cashier', icon: 'point-of-sale', color: '#4CAF50' },
  kitchen: { label: 'Kitchen', icon: 'kitchen', color: '#FFA726' },
};

const STATUS_CONFIG: Record<ShiftStatus, { label: string; color: string; bg: string }> = {
  'on-duty': { label: 'On Duty', color: '#4CAF50', bg: '#E8F5E9' },
  'off-duty': { label: 'Off Duty', color: '#666', bg: '#f0f0f0' },
  break: { label: 'On Break', color: '#FFA726', bg: '#FFF3E0' },
};

export default function StaffScreen() {
  const [filter, setFilter] = useState<StaffRole | 'all'>('all');

  const filteredStaff = filter === 'all' ? MOCK_STAFF : MOCK_STAFF.filter(s => s.role === filter);
  const onDutyCount = MOCK_STAFF.filter(s => s.status === 'on-duty').length;

  return (
    <View style={styles.container}>
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{MOCK_STAFF.length}</Text>
          <Text style={styles.summaryLabel}>Total Staff</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>{onDutyCount}</Text>
          <Text style={styles.summaryLabel}>On Duty</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: '#FFA726' }]}>{MOCK_STAFF.filter(s => s.status === 'break').length}</Text>
          <Text style={styles.summaryLabel}>On Break</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {(Object.keys(ROLE_CONFIG) as StaffRole[]).map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.filterChip, filter === role && styles.filterChipActive]}
            onPress={() => setFilter(role)}
          >
            <MaterialIcons name={ROLE_CONFIG[role].icon as any} size={16} color={filter === role ? '#fff' : '#666'} />
            <Text style={[styles.filterText, filter === role && styles.filterTextActive]}>{ROLE_CONFIG[role].label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filteredStaff.map((staff) => {
          const roleConfig = ROLE_CONFIG[staff.role];
          const statusConfig = STATUS_CONFIG[staff.status];
          return (
            <View key={staff.id} style={styles.staffCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.roleIcon, { backgroundColor: roleConfig.color + '20' }]}>
                  <MaterialIcons name={roleConfig.icon as any} size={24} color={roleConfig.color} />
                </View>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={[styles.roleLabel, { color: roleConfig.color }]}>{roleConfig.label}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                </View>
              </View>

              {staff.status !== 'off-duty' && (
                <View style={styles.shiftInfo}>
                  {staff.shiftStart && (
                    <View style={styles.shiftRow}>
                      <MaterialIcons name="schedule" size={14} color="#666" />
                      <Text style={styles.shiftText}>{staff.shiftStart} - {staff.shiftEnd}</Text>
                    </View>
                  )}
                  {staff.tablesAssigned && (
                    <View style={styles.shiftRow}>
                      <MaterialIcons name="table-restaurant" size={14} color="#666" />
                      <Text style={styles.shiftText}>Tables: {staff.tablesAssigned.join(', ')}</Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="call" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="message" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                {staff.role === 'waiter' && staff.status === 'on-duty' && (
                  <TouchableOpacity style={styles.assignBtn}>
                    <MaterialIcons name="table-restaurant" size={16} color="#fff" />
                    <Text style={styles.assignBtnText}>Assign Tables</Text>
                  </TouchableOpacity>
                )}
                {staff.status === 'on-duty' && (
                  <TouchableOpacity style={styles.breakBtn}>
                    <MaterialIcons name="free-breakfast" size={16} color="#FFA726" />
                    <Text style={styles.breakBtnText}>Break</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  summaryBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 24, fontWeight: '700', color: '#FF6B6B' },
  summaryLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  summaryDivider: { width: 1, backgroundColor: '#f0f0f0' },
  filterBar: { flexGrow: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 8 },
  filterChipActive: { backgroundColor: '#FF6B6B' },
  filterText: { fontSize: 14, color: '#666' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { flex: 1, padding: 16 },
  staffCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  roleIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  staffInfo: { flex: 1, marginLeft: 12 },
  staffName: { fontSize: 16, fontWeight: '600', color: '#333' },
  roleLabel: { fontSize: 13, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  shiftInfo: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 6 },
  shiftRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shiftText: { fontSize: 13, color: '#666' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  assignBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2196F3', borderRadius: 8, paddingVertical: 10 },
  assignBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  breakBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF3E0', borderRadius: 8 },
  breakBtnText: { fontSize: 14, fontWeight: '600', color: '#FFA726' },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  bottomSpacing: { height: 100 },
});
