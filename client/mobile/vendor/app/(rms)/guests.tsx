import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
  tags: string[];
  notes?: string;
}

const MOCK_GUESTS: Guest[] = [
  { id: '1', name: 'John Smith', phone: '+91 98765 43210', email: 'john@email.com', visits: 12, totalSpent: 15680, lastVisit: '2 days ago', tags: ['VIP', 'Regular'], notes: 'Prefers corner table' },
  { id: '2', name: 'Sarah Johnson', phone: '+91 98765 43211', visits: 8, totalSpent: 9450, lastVisit: '1 week ago', tags: ['Regular'] },
  { id: '3', name: 'Mike Brown', phone: '+91 98765 43212', email: 'mike.b@email.com', visits: 3, totalSpent: 4200, lastVisit: '3 days ago', tags: [] },
  { id: '4', name: 'Lisa Davis', phone: '+91 98765 43213', visits: 25, totalSpent: 32500, lastVisit: 'Today', tags: ['VIP', 'Anniversary'] },
  { id: '5', name: 'Tom Wilson', phone: '+91 98765 43214', visits: 5, totalSpent: 6800, lastVisit: '2 weeks ago', tags: [] },
];

const TAG_COLORS: Record<string, string> = {
  VIP: '#FFD700',
  Regular: '#4CAF50',
  Anniversary: '#E91E63',
  Birthday: '#9C27B0',
};

export default function GuestsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = MOCK_GUESTS.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.phone.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.addBtn}>
          <MaterialIcons name="person-add" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{MOCK_GUESTS.length}</Text>
          <Text style={styles.statLabel}>Total Guests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{MOCK_GUESTS.filter(g => g.tags.includes('VIP')).length}</Text>
          <Text style={styles.statLabel}>VIP Guests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{MOCK_GUESTS.filter(g => g.lastVisit === 'Today').length}</Text>
          <Text style={styles.statLabel}>Visited Today</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filteredGuests.map((guest) => (
          <TouchableOpacity
            key={guest.id}
            style={styles.guestCard}
            onPress={() => setSelectedGuest(selectedGuest?.id === guest.id ? null : guest)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{guest.name.charAt(0)}</Text>
            </View>
            <View style={styles.guestInfo}>
              <View style={styles.guestHeader}>
                <Text style={styles.guestName}>{guest.name}</Text>
                <View style={styles.tags}>
                  {guest.tags.map((tag) => (
                    <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[tag] || '#ddd' }]}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.guestStats}>
                <View style={styles.guestStat}>
                  <MaterialIcons name="receipt" size={14} color="#666" />
                  <Text style={styles.guestStatText}>{guest.visits} visits</Text>
                </View>
                <View style={styles.guestStat}>
                  <MaterialIcons name="currency-rupee" size={14} color="#666" />
                  <Text style={styles.guestStatText}>₹{guest.totalSpent.toLocaleString()}</Text>
                </View>
                <View style={styles.guestStat}>
                  <MaterialIcons name="schedule" size={14} color="#666" />
                  <Text style={styles.guestStatText}>{guest.lastVisit}</Text>
                </View>
              </View>

              {selectedGuest?.id === guest.id && (
                <View style={styles.expandedInfo}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="phone" size={16} color="#666" />
                    <Text style={styles.infoText}>{guest.phone}</Text>
                  </View>
                  {guest.email && (
                    <View style={styles.infoRow}>
                      <MaterialIcons name="email" size={16} color="#666" />
                      <Text style={styles.infoText}>{guest.email}</Text>
                    </View>
                  )}
                  {guest.notes && (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{guest.notes}</Text>
                    </View>
                  )}
                  <View style={styles.actionBtns}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialIcons name="event-seat" size={18} color="#FF6B6B" />
                      <Text style={styles.actionBtnText}>Reserve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialIcons name="history" size={18} color="#FF6B6B" />
                      <Text style={styles.actionBtnText}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialIcons name="edit" size={18} color="#FF6B6B" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#fff', borderRadius: 12, gap: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  addBtn: { padding: 8 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  statValue: { fontSize: 24, fontWeight: '700', color: '#FF6B6B' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  list: { flex: 1, padding: 16, paddingTop: 8 },
  guestCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  guestInfo: { flex: 1, marginLeft: 12 },
  guestHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  guestName: { fontSize: 16, fontWeight: '600', color: '#333' },
  tags: { flexDirection: 'row', gap: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  guestStats: { flexDirection: 'row', marginTop: 8, gap: 16 },
  guestStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  guestStatText: { fontSize: 13, color: '#666' },
  expandedInfo: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoText: { fontSize: 14, color: '#333' },
  notesBox: { backgroundColor: '#FFF3E0', padding: 12, borderRadius: 8, marginTop: 8 },
  notesLabel: { fontSize: 12, fontWeight: '600', color: '#666' },
  notesText: { fontSize: 14, color: '#333', marginTop: 4 },
  actionBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: '#FFE5E5', borderRadius: 8 },
  actionBtnText: { fontSize: 14, fontWeight: '500', color: '#FF6B6B' },
  bottomSpacing: { height: 100 },
});
