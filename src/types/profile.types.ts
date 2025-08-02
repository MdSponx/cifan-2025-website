export interface UserProfile {
  uid: string;
  email: string;
  emailVerified: boolean;      // Email verification status
  photoURL?: string;
  
  // Authentication & Role Data
  role: 'user' | 'admin' | 'super-admin';
  displayName?: string;
  
  // Profile Data
  fullNameEN: string;          // Required
  fullNameTH?: string;         // Optional for Thai users
  birthDate: Date;
  age: number;                 // Auto-calculated
  phoneNumber: string;
  nationality?: string;
  
  // Status & Metadata
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export interface ProfileFormData {
  fullNameEN: string;
  fullNameTH?: string;
  birthDate: string; // ISO date string for form input
  phoneNumber: string;
  photoFile?: File;
}

export interface ProfileFormErrors {
  fullNameEN?: string;
  fullNameTH?: string;
  birthDate?: string;
  phoneNumber?: string;
  photoFile?: string;
}

export interface PhotoUploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}
