import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  storagePath: string;
  downloadURL: string;
}

export interface FileUploadRequest {
  file: File;
  path: string;
  onProgress?: (progress: number) => void;
}

export interface ValidationRules {
  maxSize: number;
  allowedTypes: string[];
  minDuration?: number;
  maxDuration?: number;
  minResolution?: { width: number; height: number };
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileUploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public file?: string
  ) {
    super(message);
    this.name = 'FileUploadError';
  }
}

/**
 * Validates a file against specified rules
 */
export const validateFile = async (file: File, rules: ValidationRules): Promise<ValidationResult> => {
  // Check file size
  if (file.size > rules.maxSize) {
    const maxSizeMB = Math.round(rules.maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${rules.allowedTypes.join(', ')}`
    };
  }

  // Check video duration if it's a video file
  if (file.type.startsWith('video/') && (rules.minDuration || rules.maxDuration)) {
    try {
      const duration = await getVideoDuration(file);
      if (rules.minDuration && duration < rules.minDuration) {
        return {
          isValid: false,
          error: `Video duration must be at least ${rules.minDuration} minutes`
        };
      }
      if (rules.maxDuration && duration > rules.maxDuration) {
        return {
          isValid: false,
          error: `Video duration must not exceed ${rules.maxDuration} minutes`
        }
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to validate video duration'
      };
    }
  }
  // Image resolution validation removed - no longer required

  // Check image resolution if it's an image file
  // Image resolution validation removed - no longer required

  return { isValid: true };
};

/**
 * Uploads a single file to Firebase Storage
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<FileMetadata> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(new FileUploadError(
          `Failed to upload ${file.name}: ${error.message}`,
          error.code,
          file.name
        ));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const metadata: FileMetadata = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date(),
            storagePath: path,
            downloadURL
          };

          resolve(metadata);
        } catch (error) {
          console.error('Download URL error:', error);
          const firebaseError = error as any;
          
          if (firebaseError?.code === 'storage/unauthorized') {
            reject(new FileUploadError(
              `Firebase Storage permissions error. Please contact support or check Firebase Storage rules. File: ${file.name}`,
              'storage-unauthorized',
              file.name
            ));
          } else {
            reject(new FileUploadError(
              `Failed to get download URL for ${file.name}: ${firebaseError?.message || 'Unknown error'}`,
              'download-url-error',
              file.name
            ));
          }
        }
      }
    );
  });
};

/**
 * Uploads multiple files simultaneously
 */
export const uploadMultipleFiles = async (
  requests: FileUploadRequest[]
): Promise<FileMetadata[]> => {
  const uploadPromises = requests.map(request =>
    uploadFile(request.file, request.path, request.onProgress)
  );

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    // If any upload fails, we should clean up successful uploads
    // This is handled by the submission service
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage
 */
export const deleteFile = async (storagePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw new FileUploadError(
      `Failed to delete file at ${storagePath}`,
      'delete-error'
    );
  }
};

/**
 * Generates a unique file path for storage
 */
export const generateFilePath = (
  submissionId: string,
  fileType: 'film' | 'poster' | 'proof',
  fileName: string
): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `submissions/${submissionId}/${fileType}/${timestamp}_${sanitizedFileName}`;
};

/**
 * Gets video duration in minutes
 */
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const durationMinutes = video.duration / 60;
      resolve(durationMinutes);
    };
    
    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Gets image dimensions
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      window.URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      window.URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};