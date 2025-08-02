/**
 * File utilities for handling storage URLs and metadata
 */

export interface FileData {
  // Primary fields (current format)
  downloadURL?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  storagePath?: string;
  uploadedAt?: any;
  
  // Legacy fallback fields
  url?: string;
  name?: string;
  size?: number;
}

/**
 * Resolves file URL from various possible field names
 */
export const resolveFileUrl = (fileData: FileData | null | undefined): string => {
  if (!fileData) return '';
  return fileData.downloadURL || fileData.url || '';
};

/**
 * Resolves file name from various possible field names
 */
export const resolveFileName = (fileData: FileData | null | undefined): string => {
  if (!fileData) return '';
  return fileData.fileName || fileData.name || '';
};

/**
 * Resolves file size from various possible field names
 */
export const resolveFileSize = (fileData: FileData | null | undefined): number => {
  if (!fileData) return 0;
  return fileData.fileSize || fileData.size || 0;
};

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 MB';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

/**
 * Checks if a file URL is valid and accessible
 */
export const isValidFileUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets file extension from filename or URL
 */
export const getFileExtension = (filename: string): string => {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
};

/**
 * Determines file type based on extension
 */
export const getFileType = (filename: string): 'image' | 'video' | 'document' | 'unknown' => {
  const extension = getFileExtension(filename);
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (documentExtensions.includes(extension)) return 'document';
  
  return 'unknown';
};

/**
 * Creates a fallback display for missing files
 */
export const createFileFallback = (
  fileType: 'image' | 'video' | 'document',
  language: 'en' | 'th' = 'en'
): { icon: string; message: string } => {
  const fallbacks = {
    image: {
      icon: '🖼️',
      message: {
        en: 'Image not available',
        th: 'ไม่สามารถโหลดรูปภาพได้'
      }
    },
    video: {
      icon: '🎬',
      message: {
        en: 'Video not available',
        th: 'ไม่สามารถโหลดวิดีโอได้'
      }
    },
    document: {
      icon: '📄',
      message: {
        en: 'Document not available',
        th: 'ไม่สามารถโหลดเอกสารได้'
      }
    }
  };
  
  const fallback = fallbacks[fileType];
  return {
    icon: fallback.icon,
    message: fallback.message[language]
  };
};

/**
 * Validates if file data has required fields
 */
export const validateFileData = (fileData: FileData | null | undefined): {
  isValid: boolean;
  hasUrl: boolean;
  hasName: boolean;
  hasSize: boolean;
} => {
  const hasUrl = !!(fileData?.downloadURL || fileData?.url);
  const hasName = !!(fileData?.fileName || fileData?.name);
  const hasSize = !!(fileData?.fileSize || fileData?.size);
  
  return {
    isValid: hasUrl && hasName,
    hasUrl,
    hasName,
    hasSize
  };
};

/**
 * Normalizes file data to consistent format
 */
export const normalizeFileData = (fileData: FileData | null | undefined): {
  url: string;
  name: string;
  size: number;
} => {
  return {
    url: resolveFileUrl(fileData),
    name: resolveFileName(fileData),
    size: resolveFileSize(fileData)
  };
};
