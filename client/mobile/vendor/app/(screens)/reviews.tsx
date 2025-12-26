import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MOCK_REVIEWS = [
  { id: '1', user: 'John D.', rating: 5, comment: 'Excellent food and fast delivery!', date: '2 days ago', reply: null },
  { id: '2', user: 'Sarah M.', rating: 4, comment: 'Good taste but portion could be bigger.', date: '3 days ago', reply: 'Thank you for your feedback!' },
  { id: '3', user: 'Mike R.', rating: 5, comment: 'Best biryani in town!', date: '1 week ago', reply: null },
];

export default function ReviewsScreen() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (reviewId: string) => {
    console.log('Reply to', reviewId, ':', replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <MaterialIcons
        key={i}
        name={i < rating ? 'star' : 'star-border'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryCard}>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingValue}>4.6</Text>
          <View style={styles.starsRow}>{renderStars(5)}</View>
          <Text style={styles.ratingCount}>245 reviews</Text>
        </View>
        <View style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.ratingBarRow}>
              <Text style={styles.starLabel}>{star}</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.reviewsList}>
        {MOCK_REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{review.user[0]}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{review.user}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <View style={styles.starsRow}>{renderStars(review.rating)}</View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>

            {review.reply ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyLabel}>Your reply:</Text>
                <Text style={styles.replyText}>{review.reply}</Text>
              </View>
            ) : replyingTo === review.id ? (
              <View style={styles.replyInputBox}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Write your reply..."
                  placeholderTextColor="#999"
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                />
                <View style={styles.replyActions}>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <Text style={styles.cancelBtn}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitReplyBtn}
                    onPress={() => handleSubmitReply(review.id)}
                  >
                    <Text style={styles.submitReplyText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() => setReplyingTo(review.id)}
              >
                <MaterialIcons name="reply" size={16} color="#FF6B6B" />
                <Text style={styles.replyBtnText}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  ratingBox: {
    alignItems: 'center',
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#333',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  ratingBars: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: 'center',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starLabel: {
    width: 16,
    fontSize: 12,
    color: '#666',
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginLeft: 8,
  },
  barFill: {
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  reviewsList: {
    marginTop: 16,
  },
  reviewCard: {
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
      android: { elevation: 4 },
    }),
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 12,
  },
  replyBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: '#333',
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  replyBtnText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  replyInputBox: {
    marginTop: 12,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 8,
  },
  submitReplyBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitReplyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
});
