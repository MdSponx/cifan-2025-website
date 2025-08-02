import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { FILE_TYPES } from './formConstants';

export interface UploadProgress {
  progress: number;
  isUploading: boolean;
  error?: string;
}

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
}

// Upload file to Firebase Storage
export const uploadFile = async (
  file: File, 
  path: string,
  onProgress?: (progress: number) => void
): Promise<FileUploadResult> => {
  try {
    const storageRef = ref(storage, path);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      fileName: file.name,
      fileSize: file.size
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Generate upload path based on category and file type
export const generateUploadPath = (
  category: string,
  fileType: 'films' | 'posters' | 'proofs',
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `submissions/${category}/${fileType}/${timestamp}_${sanitizedFileName}`;
};

// Validate file before upload
export const validateFileForUpload = (
  file: File,
  fileType: keyof typeof FILE_TYPES
): { isValid: boolean; error?: string } => {
  const config = FILE_TYPES[fileType];
  
  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${maxSizeMB}MB`
    };
  }
  
  // Check file type
  if (!config.types.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${config.types.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension
export const getFileExtension = (fileName: string): string => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Check if file is video
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

// Create file preview URL
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Cleanup file preview URL
export const cleanupFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
