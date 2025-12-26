import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ReservationStatus = 'upcoming' | 'seated' | 'completed' | 'cancelled';

interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  tableNumber?: number;
  status: ReservationStatus;
  notes?: string;
}

const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', guestName: 'John Smith', phone: '+91 98765 43210', partySize: 4, date: 'Today', time: '7:00 PM', tableNumber: 4, status: 'upcoming', notes: 'Birthday celebration' },
  { id: '2', guestName: 'Sarah Johnson', phone: '+91 98765 43211', partySize: 2, date: 'Today', time: '7:30 PM', status: 'upcoming' },
  { id: '3', guestName: 'Mike Brown', phone: '+91 98765 43212', partySize: 6, date: 'Today', time: '8:00 PM', tableNumber: 7, status: 'upcoming', notes: 'Anniversary dinner' },
  { id: '4', guestName: 'Lisa Davis', phone: '+91 98765 43213', partySize: 2, date: 'Today', time: '1:00 PM', tableNumber: 2, status: 'seated' },
  { id: '5', guestName: 'Tom Wilson', phone: '+91 98765 43214', partySize: 4, date: 'Today', time: '12:00 PM', status: 'completed' },
  { id: '6', guestName: 'Emma Clark', phone: '+91 98765 43215', partySize: 3, date: 'Tomorrow', time: '7:00 PM', status: 'upcoming' },
];

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: '#2196F3', bg: '#E3F2FD' },
  seated: { label: 'Seated', color: '#4CAF50', bg: '#E8F5E9' },
  completed: { label: 'Completed', color: '#666', bg: '#f0f0f0' },
  cancelled: { label: 'Cancelled', color: '#F44336', bg: '#FFEBEE' },
};

export default function ReservationsScreen() {
  const [filter, setFilter] = useState<'today' | 'tomorrow' | 'all'>('today');

  const filteredReservations = MOCK_RESERVATIONS.filter(r => {
    if (filter === 'today') return r.date === 'Today';
    if (filter === 'tomorrow') return r.date === 'Tomorrow';
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterRow}>
          {(['today', 'tomorrow', 'all'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
                {f === 'today' ? 'Today' : f === 'tomorrow' ? 'Tomorrow' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filteredReservations.map((reservation) => {
          const config = STATUS_CONFIG[reservation.status];
          return (
            <View key={reservation.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.timeBox}>
                  <Text style={styles.time}>{reservation.time}</Text>
                  <Text style={styles.date}>{reservation.date}</Text>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{reservation.guestName}</Text>
                  <View style={styles.detailsRow}>
                    <MaterialIcons name="people" size={14} color="#666" />
                    <Text style={styles.detailText}>{reservation.partySize} guests</Text>
                    {reservation.tableNumber && (
                      <>
                        <MaterialIcons name="table-restaurant" size={14} color="#666" style={{ marginLeft: 12 }} />
                        <Text style={styles.detailText}>Table {reservation.tableNumber}</Text>
                      </>
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                  <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                </View>
              </View>

              {reservation.notes && (
                <View style={styles.notesRow}>
                  <MaterialIcons name="note" size={14} color="#666" />
                  <Text style={styles.notesText}>{reservation.notes}</Text>
                </View>
              )}

              {reservation.status === 'upcoming' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="call" size={16} color="#FF6B6B" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="event-seat" size={16} color="#FF6B6B" />
                    <Text style={styles.actionText}>Seat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="edit" size={16} color="#FF6B6B" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="close" size={16} color="#F44336" />
                    <Text style={[styles.actionText, { color: '#F44336' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', gap: 12 },
  filterRow: { flex: 1, flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  filterBtnActive: { backgroundColor: '#FF6B6B' },
  filterBtnText: { fontSize: 14, color: '#666' },
  filterBtnTextActive: { color: '#fff', fontWeight: '600' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  timeBox: { alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#f0f0f0' },
  time: { fontSize: 16, fontWeight: '700', color: '#FF6B6B' },
  date: { fontSize: 12, color: '#666', marginTop: 2 },
  guestInfo: { flex: 1, marginLeft: 16 },
  guestName: { fontSize: 16, fontWeight: '600', color: '#333' },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  detailText: { fontSize: 13, color: '#666' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  notesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 10, backgroundColor: '#FFF3E0', borderRadius: 8 },
  notesText: { fontSize: 13, color: '#666', flex: 1 },
  actions: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 14, color: '#FF6B6B', fontWeight: '500' },
  bottomSpacing: { height: 100 },
});
