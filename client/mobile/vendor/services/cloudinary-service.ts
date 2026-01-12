import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiClient } from './api';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId?: string;
  uploadUrl: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// Request camera permissions
export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}

// Request media library permissions
export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}

// Pick single image from gallery
export async function pickImage(): Promise<string | null> {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new Error('Media library permission required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

// Pick multiple images from gallery
export async function pickMultipleImages(maxCount: number = 5): Promise<string[]> {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new Error('Media library permission required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: maxCount,
    aspect: [1, 1],
    quality: 0.9,
  });

  if (result.canceled) return [];
  return result.assets.map((asset) => asset.uri);
}

// Take photo with camera
export async function takePhoto(): Promise<string | null> {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new Error('Camera permission required');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

// Compress and resize image
export async function compressImage(uri: string): Promise<string> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800, height: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulated.uri;
}

// Get file size from URI
async function getFileSize(uri: string): Promise<number> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch {
    return 0;
  }
}

// Get upload signature from server
async function getUploadSignature(
  type: 'dish' | 'logo' | 'cover' = 'dish',
  filename?: string
): Promise<UploadSignature> {
  const response = await apiClient.post<UploadSignature>('/upload/cloudinary/signature', {
    type,
    filename,
  });
  return response.data!;
}

// Upload single image to Cloudinary
export async function uploadImage(
  imageUri: string,
  type: 'dish' | 'logo' | 'cover' = 'dish',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Compress image first
  const compressedUri = await compressImage(imageUri);

  // Check file size
  const fileSize = await getFileSize(compressedUri);
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image exceeds ${MAX_FILE_SIZE_MB}MB limit`);
  }

  // Get signature from server
  const sig = await getUploadSignature(type);

  // Prepare form data
  const formData = new FormData();
  const filename = compressedUri.split('/').pop() || 'image.jpg';

  formData.append('file', {
    uri: compressedUri,
    type: 'image/jpeg',
    name: filename,
  } as any);

  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', sig.timestamp.toString());
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);
  if (sig.publicId) {
    formData.append('public_id', sig.publicId);
  }

  // Upload to Cloudinary
  const response = await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('timeout', () => reject(new Error('Upload timeout')));

    xhr.open('POST', sig.uploadUrl);
    xhr.timeout = 120000; // 2 min timeout for slow connections
    xhr.send(formData);
  });

  return response.secure_url;
}

// Upload multiple images
export async function uploadMultipleImages(
  imageUris: string[],
  type: 'dish' | 'logo' | 'cover' = 'dish',
  onProgress?: (current: number, total: number, itemProgress: UploadProgress) => void
): Promise<string[]> {
  const urls: string[] = [];
  const total = imageUris.length;

  for (let i = 0; i < imageUris.length; i++) {
    const url = await uploadImage(imageUris[i], type, (progress) => {
      onProgress?.(i + 1, total, progress);
    });
    urls.push(url);
  }

  return urls;
}

export const cloudinaryService = {
  pickImage,
  pickMultipleImages,
  takePhoto,
  compressImage,
  uploadImage,
  uploadMultipleImages,
  requestCameraPermission,
  requestMediaLibraryPermission,
};
