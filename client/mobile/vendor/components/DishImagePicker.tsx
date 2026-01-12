import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cloudinaryService } from '../services/cloudinary-service';

const MAX_IMAGES = 5;

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  required?: boolean;
  error?: string;
}

interface UploadingImage {
  uri: string;
  progress: number;
}

export function DishImagePicker({
  images,
  onChange,
  maxImages = MAX_IMAGES,
  required = true,
  error,
}: Props) {
  const [uploading, setUploading] = useState<UploadingImage[]>([]);

  const canAddMore = images.length + uploading.length < maxImages;

  const showImageOptions = () => {
    Alert.alert('Add Photos', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Gallery', onPress: handlePickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleTakePhoto = async () => {
    if (!canAddMore) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      const uri = await cloudinaryService.takePhoto();
      if (uri) {
        await uploadSingleImage(uri);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handlePickFromGallery = async () => {
    const remaining = maxImages - images.length - uploading.length;
    if (remaining <= 0) {
      Alert.alert('Limit Reached', `Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      const uris = await cloudinaryService.pickMultipleImages(remaining);
      if (uris.length > 0) {
        await uploadMultipleImages(uris);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const uploadSingleImage = async (uri: string) => {
    const uploadId = uri;
    setUploading((prev) => [...prev, { uri, progress: 0 }]);

    try {
      const url = await cloudinaryService.uploadImage(uri, 'dish', (progress) => {
        setUploading((prev) =>
          prev.map((item) =>
            item.uri === uploadId ? { ...item, progress: progress.percent } : item
          )
        );
      });

      onChange([...images, url]);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setUploading((prev) => prev.filter((item) => item.uri !== uploadId));
    }
  };

  const uploadMultipleImages = async (uris: string[]) => {
    const uploadItems = uris.map((uri) => ({ uri, progress: 0 }));
    setUploading((prev) => [...prev, ...uploadItems]);

    const uploadedUrls: string[] = [];

    for (const uri of uris) {
      try {
        const url = await cloudinaryService.uploadImage(uri, 'dish', (progress) => {
          setUploading((prev) =>
            prev.map((item) =>
              item.uri === uri ? { ...item, progress: progress.percent } : item
            )
          );
        });
        uploadedUrls.push(url);
      } catch (err: any) {
        console.error('Upload failed for', uri, err);
      } finally {
        setUploading((prev) => prev.filter((item) => item.uri !== uri));
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert('Remove Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newImages = [...images];
          newImages.splice(index, 1);
          onChange(newImages);
        },
      },
    ]);
  };

  const reorderImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  const moveToFirst = (index: number) => {
    if (index === 0) return;
    reorderImage(index, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>
          Dish Images {required && <Text style={styles.required}>*</Text>}
        </Text>
        <Text style={styles.count}>
          {images.length}/{maxImages}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Button */}
        {canAddMore && (
          <TouchableOpacity
            style={[styles.addButton, error && images.length === 0 && styles.addButtonError]}
            onPress={showImageOptions}
          >
            <MaterialIcons name="add-a-photo" size={28} color="#999" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}

        {/* Uploading Images */}
        {uploading.map((item) => (
          <View key={item.uri} style={styles.imageWrapper}>
            <Image source={{ uri: item.uri }} style={[styles.image, styles.uploadingImage]} />
            <View style={styles.uploadOverlay}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          </View>
        ))}

        {/* Existing Images */}
        {images.map((url, index) => (
          <View key={url} style={styles.imageWrapper}>
            <Image source={{ uri: url }} style={styles.image} />
            {index === 0 && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeImage(index)}
            >
              <MaterialIcons name="close" size={16} color="#fff" />
            </TouchableOpacity>
            {index !== 0 && (
              <TouchableOpacity
                style={styles.setPrimaryBtn}
                onPress={() => moveToFirst(index)}
              >
                <MaterialIcons name="star" size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.hint}>
        First image is the primary display image. Tap star to change.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#e53935',
  },
  count: {
    fontSize: 12,
    color: '#666',
  },
  scrollView: {
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  uploadingImage: {
    opacity: 0.5,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  primaryBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 4,
  },
  setPrimaryBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 4,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonError: {
    borderColor: '#e53935',
  },
  addText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 8,
  },
  hint: {
    color: '#888',
    fontSize: 11,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
