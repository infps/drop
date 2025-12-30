import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsScreen() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/reviews');
      if (res.data.status === 'success') {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [fetchReviews])
  );

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/vendor/reviews/${reviewId}/reply`, { reply: replyText });
      if (res.data.status === 'success') {
        Alert.alert('Success', 'Reply posted');
        setReplyingTo(null);
        setReplyText('');
        fetchReviews();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {reviews.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingValue}>{avgRating.toFixed(1)}</Text>
            <View style={styles.starsRow}>{renderStars(Math.round(avgRating))}</View>
            <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
          </View>
        </View>
      )}

      <View style={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const hasReply = review.comment?.includes('[Vendor Reply]');
            const [mainComment, vendorReply] = hasReply
              ? review.comment.split('\n\n[Vendor Reply]: ')
              : [review.comment, null];

            return (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{review.user.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>{review.user.name}</Text>
                      <Text style={styles.reviewDate}>
                        {formatDistanceToNow(new Date(review.createdAt))} ago
                      </Text>
                    </View>
                  </View>
                  <View style={styles.starsRow}>{renderStars(review.rating)}</View>
                </View>
                <Text style={styles.reviewComment}>{mainComment}</Text>

                {vendorReply ? (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyLabel}>Your reply:</Text>
                    <Text style={styles.replyText}>{vendorReply}</Text>
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
                        disabled={submitting}
                      >
                        <Text style={styles.submitReplyText}>
                          {submitting ? 'Posting...' : 'Reply'}
                        </Text>
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
            );
          })
        ) : (
          <Text style={styles.emptyText}>No reviews yet</Text>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 40,
    fontSize: 14,
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
