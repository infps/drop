import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface WaitlistEntry {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  waitTime: string;
  addedAt: string;
  notes?: string;
}

const MOCK_WAITLIST: WaitlistEntry[] = [
  { id: '1', guestName: 'Alex Turner', phone: '+91 98765 43220', partySize: 2, waitTime: '15 min', addedAt: '2:30 PM' },
  { id: '2', guestName: 'Rachel Green', phone: '+91 98765 43221', partySize: 4, waitTime: '10 min', addedAt: '2:35 PM', notes: 'Near window preferred' },
  { id: '3', guestName: 'David Lee', phone: '+91 98765 43222', partySize: 6, waitTime: '5 min', addedAt: '2:40 PM' },
];

export default function WaitlistScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '', partySize: '2', notes: '' });

  const estimatedWait = MOCK_WAITLIST.length * 10;

  return (
    <View style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_WAITLIST.length}</Text>
          <Text style={styles.statLabel}>In Queue</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>~{estimatedWait} min</Text>
          <Text style={styles.statLabel}>Est. Wait</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Tables Available</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {MOCK_WAITLIST.map((entry, index) => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.queueNumber}>
              <Text style={styles.queueNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.entryInfo}>
              <View style={styles.entryHeader}>
                <Text style={styles.guestName}>{entry.guestName}</Text>
                <Text style={styles.waitTime}>{entry.waitTime}</Text>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detail}>
                  <MaterialIcons name="people" size={14} color="#666" />
                  <Text style={styles.detailText}>{entry.partySize}</Text>
                </View>
                <View style={styles.detail}>
                  <MaterialIcons name="schedule" size={14} color="#666" />
                  <Text style={styles.detailText}>Added {entry.addedAt}</Text>
                </View>
              </View>
              {entry.notes && (
                <Text style={styles.notes}>{entry.notes}</Text>
              )}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="call" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="message" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.seatBtn]}>
                  <MaterialIcons name="event-seat" size={16} color="#fff" />
                  <Text style={styles.seatBtnText}>Seat Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MaterialIcons name="close" size={18} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {MOCK_WAITLIST.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="hourglass-empty" size={64} color="#ddd" />
            <Text style={styles.emptyTitle}>No one waiting</Text>
            <Text style={styles.emptyDesc}>Add guests to the waitlist when tables are full</Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <MaterialIcons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Waitlist</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Guest Name</Text>
              <TextInput
                style={styles.input}
                value={newGuest.name}
                onChangeText={(t) => setNewGuest({ ...newGuest, name: t })}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newGuest.phone}
                onChangeText={(t) => setNewGuest({ ...newGuest, phone: t })}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Party Size</Text>
              <View style={styles.partySizeRow}>
                {['1', '2', '3', '4', '5', '6+'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.partySizeBtn, newGuest.partySize === size && styles.partySizeBtnActive]}
                    onPress={() => setNewGuest({ ...newGuest, partySize: size })}
                  >
                    <Text style={[styles.partySizeText, newGuest.partySize === size && styles.partySizeTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGuest.notes}
                onChangeText={(t) => setNewGuest({ ...newGuest, notes: t })}
                placeholder="Special requests, preferences..."
                multiline
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.submitBtnText}>Add to Waitlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  statsBar: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#f0f0f0' },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }),
  },
  queueNumber: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFE5E5', justifyContent: 'center', alignItems: 'center' },
  queueNumberText: { fontSize: 18, fontWeight: '700', color: '#FF6B6B' },
  entryInfo: { flex: 1, marginLeft: 12 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guestName: { fontSize: 16, fontWeight: '600', color: '#333' },
  waitTime: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
  detailsRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 13, color: '#666' },
  notes: { fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  seatBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, backgroundColor: '#4CAF50', borderRadius: 8, paddingVertical: 8, justifyContent: 'center' },
  seatBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  emptyState: { alignItems: 'center', paddingVertical: 64 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  bottomSpacing: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  textArea: { height: 80, textAlignVertical: 'top' },
  partySizeRow: { flexDirection: 'row', gap: 8 },
  partySizeBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
  partySizeBtnActive: { backgroundColor: '#FF6B6B' },
  partySizeText: { fontSize: 16, fontWeight: '600', color: '#666' },
  partySizeTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: '#FF6B6B', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
