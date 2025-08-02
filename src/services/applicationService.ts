import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteFile, uploadFile, generateFilePath, validateFile, FileMetadata } from './fileUploadService';

export interface FilmApplication {
  id: string;
  userId: string;
  applicationId: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted';
  filmTitle: string;
  filmTitleTh?: string;
  genres: string[];
  format: string;
  duration: number;
  synopsis: string;
  files: {
    filmFile: FileMetadata;
    posterFile: FileMetadata;
    proofFile?: FileMetadata;
  };
  submittedAt?: any;
  createdAt: any;
  lastModified: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileReplaceRequest {
  applicationId: string;
  fileType: 'filmFile' | 'posterFile' | 'proofFile';
  newFile: File;
  onProgress?: (progress: number) => void;
}

export interface SubmissionProgress {
  stage: 'validating' | 'updating' | 'complete' | 'error';
  progress: number;
  message: string;
}

export class ApplicationService {
  private onProgress?: (progress: SubmissionProgress) => void;

  constructor(onProgress?: (progress: SubmissionProgress) => void) {
    this.onProgress = onProgress;
  }

  /**
   * Submit an application (change status from draft to submitted)
   */
  async submitApplication(applicationId: string): Promise<void> {
    try {
      this.updateProgress('validating', 0, 'Validating application...');

      // Get current application data
      const docRef = doc(db, 'submissions', applicationId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const application = { id: docSnap.id, ...docSnap.data() } as FilmApplication;

      // Validate before submission
      const validation = this.validateBeforeSubmit(application);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      this.updateProgress('updating', 50, 'Submitting application...');

      // Update application status
      await updateDoc(docRef, {
        status: 'submitted',
        submittedAt: serverTimestamp(),
        lastModified: serverTimestamp()
      });

      this.updateProgress('complete', 100, 'Application submitted successfully!');

    } catch (error) {
      console.error('Error submitting application:', error);
      this.updateProgress('error', 0, error instanceof Error ? error.message : 'Unknown error occurred');
      throw error;
    }
  }

  /**
   * Check if an application can be submitted
   */
  canSubmitApplication(application: FilmApplication): boolean {
    if (application.status !== 'draft') {
      return false;
    }

    const validation = this.validateBeforeSubmit(application);
    return validation.isValid;
  }

  /**
   * Validate application before submission
   */
  validateBeforeSubmit(application: FilmApplication): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!application.filmTitle?.trim()) {
      errors.push('Film title is required');
    }

    if (!application.genres || application.genres.length === 0) {
      errors.push('At least one genre must be selected');
    }

    if (!application.format) {
      errors.push('Film format must be selected');
    }

    if (!application.duration || application.duration <= 0) {
      errors.push('Film duration must be specified');
    }

    if (!application.synopsis?.trim()) {
      errors.push('Synopsis is required');
    }

    // File validation
    if (!application.files?.filmFile) {
      errors.push('Film file is required');
    }

    if (!application.files?.posterFile) {
      errors.push('Poster file is required');
    }

    // Duration recommendations (warnings only)
    if (application.duration < 5) {
      warnings.push('Film duration is less than 5 minutes (recommended minimum)');
    }

    if (application.duration > 10) {
      warnings.push('Film duration exceeds 10 minutes (recommended maximum)');
    }

    // File size warnings
    if (application.files?.filmFile && application.files.filmFile.fileSize > 400 * 1024 * 1024) {
      warnings.push('Film file size is quite large (>400MB). Consider compression for faster upload.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Replace a file in an application
   */
  async replaceFile(request: FileReplaceRequest): Promise<FileMetadata> {
    try {
      // Get current application data
      const docRef = doc(db, 'submissions', request.applicationId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const application = { id: docSnap.id, ...docSnap.data() } as FilmApplication;

      // Check if application can be edited
      if (application.status !== 'draft') {
        throw new Error('Cannot replace files in submitted applications');
      }

      // Validate new file
      const fileValidation = await this.validateFileForType(request.newFile, request.fileType);
      if (!fileValidation.isValid) {
        throw new Error(`File validation failed: ${fileValidation.error}`);
      }

      // Get old file path for deletion
      const oldFile = application.files[request.fileType];
      const oldFilePath = oldFile?.storagePath;

      // Upload new file
      const fileTypeMap: { [key: string]: 'film' | 'poster' | 'proof' } = {
        'filmFile': 'film',
        'posterFile': 'poster',
        'proofFile': 'proof'
      };

      const newFilePath = generateFilePath(
        application.applicationId, 
        fileTypeMap[request.fileType], 
        request.newFile.name
      );

      const newFileMetadata = await uploadFile(
        request.newFile,
        newFilePath,
        request.onProgress
      );

      // Update application with new file
      const updateData = {
        [`files.${request.fileType}`]: {
          ...newFileMetadata,
          uploadedAt: serverTimestamp()
        },
        lastModified: serverTimestamp()
      };

      await updateDoc(docRef, updateData);

      // Delete old file if it exists
      if (oldFilePath) {
        try {
          await deleteFile(oldFilePath);
        } catch (error) {
          console.warn('Failed to delete old file:', error);
          // Don't throw error for cleanup failure
        }
      }

      return newFileMetadata;

    } catch (error) {
      console.error('Error replacing file:', error);
      throw error;
    }
  }

  /**
   * Delete an application (only drafts)
   */
  async deleteApplication(applicationId: string): Promise<void> {
    try {
      // Get current application data
      const docRef = doc(db, 'submissions', applicationId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const application = { id: docSnap.id, ...docSnap.data() } as FilmApplication;

      // Check if application can be deleted
      if (application.status !== 'draft') {
        throw new Error('Cannot delete submitted applications');
      }

      // Delete associated files
      const filesToDelete = [
        application.files?.filmFile?.storagePath,
        application.files?.posterFile?.storagePath,
        application.files?.proofFile?.storagePath
      ].filter(Boolean);

      await Promise.all(
        filesToDelete.map(async (filePath) => {
          try {
            await deleteFile(filePath!);
          } catch (error) {
            console.warn('Failed to delete file:', filePath, error);
          }
        })
      );

      // Delete application document
      await updateDoc(docRef, {
        status: 'deleted',
        deletedAt: serverTimestamp(),
        lastModified: serverTimestamp()
      });

    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  /**
   * Withdraw a submitted application
   */
  async withdrawApplication(applicationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'submissions', applicationId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Application not found');
      }

      const application = { id: docSnap.id, ...docSnap.data() } as FilmApplication;

      if (application.status !== 'submitted') {
        throw new Error('Can only withdraw submitted applications');
      }

      // Update application status
      await updateDoc(docRef, {
        status: 'withdrawn',
        withdrawnAt: serverTimestamp(),
        lastModified: serverTimestamp()
      });

    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  }

  /**
   * Validate file based on type
   */
  private async validateFileForType(file: File, fileType: string): Promise<{ isValid: boolean; error?: string }> {
    const validationRules = {
      filmFile: {
        maxSize: 500 * 1024 * 1024, // 500MB
        allowedTypes: ['video/mp4', 'video/quicktime']
      },
      posterFile: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png']
      },
      proofFile: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
      }
    };

    const rules = validationRules[fileType as keyof typeof validationRules];
    if (!rules) {
      return { isValid: false, error: 'Unknown file type' };
    }

    return await validateFile(file, rules);
  }

  /**
   * Update progress callback
   */
  private updateProgress(
    stage: SubmissionProgress['stage'],
    progress: number,
    message: string
  ): void {
    this.onProgress?.({
      stage,
      progress,
      message
    });
  }
}

export default ApplicationService;
