import { collection, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DURATION_LIMITS } from '../utils/formConstants';
import { 
  uploadMultipleFiles, 
  deleteFile, 
  generateFilePath, 
  validateFile,
  FileMetadata,
  FileUploadRequest,
  ValidationRules,
  FileUploadError
} from './fileUploadService';
import { YouthFormData, FutureFormData, WorldFormData } from '../types/form.types';

export interface SubmissionProgress {
  stage: 'validating' | 'uploading' | 'saving' | 'complete' | 'error';
  progress: number;
  message: string;
  fileProgress?: { [key: string]: number };
}

export interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  error?: string;
  errorCode?: string;
  isDraft?: boolean;
}

export class SubmissionError extends Error {
  constructor(
    message: string,
    public code: string,
    public stage: string
  ) {
    super(message);
    this.name = 'SubmissionError';
  }
}

// File validation rules
const FILE_VALIDATION_RULES: { [key: string]: ValidationRules } = {
  film: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/quicktime']
    // Removed duration limits - now handled as recommendations only
  },
  poster: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png']
  },
  proof: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
  }
};

/**
 * Main submission service class
 */
export class SubmissionService {
  private onProgress?: (progress: SubmissionProgress) => void;
  private uploadedFiles: FileMetadata[] = [];
  private submissionId?: string;

  constructor(onProgress?: (progress: SubmissionProgress) => void) {
    this.onProgress = onProgress;
  }

  /**
   * Saves a youth form as draft (with conditional file uploads)
   */
  async saveDraftYouthForm(formData: YouthFormData): Promise<SubmissionResult> {
    try {
      // Generate unique submission ID
      this.submissionId = `youth_draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Stage 1: Validation (draft mode - no file requirements)
      this.updateProgress('validating', 0, 'Validating draft data...');
      await this.validateFormData(formData, true);

      // Stage 2: Conditional file upload for drafts
      let fileMetadata: { [key: string]: FileMetadata } | null = null;
      
      // Check if any files exist in formData
      const hasFiles = formData.filmFile || formData.posterFile || formData.proofFile;
      
      if (hasFiles) {
        this.updateProgress('uploading', 20, 'Uploading files...');
        fileMetadata = await this.uploadFilesForDraft(formData, this.submissionId);
        this.updateProgress('saving', 70, 'Saving draft with files...');
      } else {
        this.updateProgress('saving', 50, 'Saving draft...');
      }

      // Stage 3: Save to Firestore with or without files
      const docRef = await this.saveDraftToFirestore('youth', formData, fileMetadata);

      // Stage 4: Complete
      this.updateProgress('complete', 100, 'Draft saved successfully!');

      return {
        success: true,
        submissionId: docRef.id,
        isDraft: true
      };

    } catch (error) {
      console.error('Draft save error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error',
        isDraft: true
      };
    }
  }

  /**
   * Submits a youth form with file uploads
   */
  async submitYouthForm(formData: YouthFormData): Promise<SubmissionResult> {
    try {
      // Generate unique submission ID
      this.submissionId = `youth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Stage 1: Validation
      this.updateProgress('validating', 0, 'Validating form data and files...');
      await this.validateFormData(formData);

      // Stage 2: File Upload
      this.updateProgress('uploading', 20, 'Uploading files...');
      const fileMetadata = await this.uploadFiles(formData, this.submissionId);

      // Stage 3: Save to Firestore
      this.updateProgress('saving', 80, 'Saving submission...');
      const docRef = await this.saveToFirestore('youth', formData, fileMetadata);

      // Stage 4: Complete
      this.updateProgress('complete', 100, 'Submission completed successfully!');

      return {
        success: true,
        submissionId: docRef.id
      };

    } catch (error) {
      console.error('Submission error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error'
      };
    }
  }

  /**
   * Saves a future form as draft (with conditional file uploads)
   */
  async saveDraftFutureForm(formData: FutureFormData): Promise<SubmissionResult> {
    try {
      this.submissionId = `future_draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.updateProgress('validating', 0, 'Validating draft data...');
      await this.validateFormData(formData, true);

      // Stage 2: Conditional file upload for drafts
      let fileMetadata: { [key: string]: FileMetadata } | null = null;
      
      // Check if any files exist in formData
      const hasFiles = formData.filmFile || formData.posterFile || formData.proofFile;
      
      if (hasFiles) {
        this.updateProgress('uploading', 20, 'Uploading files...');
        fileMetadata = await this.uploadFilesForDraft(formData, this.submissionId);
        this.updateProgress('saving', 70, 'Saving draft with files...');
      } else {
        this.updateProgress('saving', 50, 'Saving draft...');
      }

      // Stage 3: Save to Firestore with or without files
      const docRef = await this.saveDraftToFirestore('future', formData, fileMetadata);

      this.updateProgress('complete', 100, 'Draft saved successfully!');

      return {
        success: true,
        submissionId: docRef.id,
        isDraft: true
      };

    } catch (error) {
      console.error('Draft save error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error',
        isDraft: true
      };
    }
  }

  /**
   * Saves a world form as draft (with conditional file uploads)
   */
  async saveDraftWorldForm(formData: WorldFormData): Promise<SubmissionResult> {
    try {
      this.submissionId = `world_draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.updateProgress('validating', 0, 'Validating draft data...');
      await this.validateFormData(formData, true);

      // Stage 2: Conditional file upload for drafts
      let fileMetadata: { [key: string]: FileMetadata } | null = null;
      
      // Check if any files exist in formData
      const hasFiles = formData.filmFile || formData.posterFile || formData.proofFile;
      
      if (hasFiles) {
        this.updateProgress('uploading', 20, 'Uploading files...');
        fileMetadata = await this.uploadFilesForDraft(formData, this.submissionId);
        this.updateProgress('saving', 70, 'Saving draft with files...');
      } else {
        this.updateProgress('saving', 50, 'Saving draft...');
      }

      // Stage 3: Save to Firestore with or without files
      const docRef = await this.saveDraftToFirestore('world', formData, fileMetadata);

      this.updateProgress('complete', 100, 'Draft saved successfully!');

      return {
        success: true,
        submissionId: docRef.id,
        isDraft: true
      };

    } catch (error) {
      console.error('Draft save error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error',
        isDraft: true
      };
    }
  }

  /**
   * Submits a future form with file uploads
   */
  async submitFutureForm(formData: FutureFormData): Promise<SubmissionResult> {
    try {
      this.submissionId = `future_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.updateProgress('validating', 0, 'Validating form data and files...');
      await this.validateFormData(formData);

      this.updateProgress('uploading', 20, 'Uploading files...');
      const fileMetadata = await this.uploadFiles(formData, this.submissionId);

      this.updateProgress('saving', 80, 'Saving submission...');
      const docRef = await this.saveToFirestore('future', formData, fileMetadata);

      this.updateProgress('complete', 100, 'Submission completed successfully!');

      return {
        success: true,
        submissionId: docRef.id
      };

    } catch (error) {
      console.error('Submission error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error'
      };
    }
  }

  /**
   * Submits a world form with file uploads
   */
  async submitWorldForm(formData: WorldFormData): Promise<SubmissionResult> {
    try {
      this.submissionId = `world_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.updateProgress('validating', 0, 'Validating form data and files...');
      await this.validateFormData(formData);

      this.updateProgress('uploading', 20, 'Uploading files...');
      const fileMetadata = await this.uploadFiles(formData, this.submissionId);

      this.updateProgress('saving', 80, 'Saving submission...');
      const docRef = await this.saveToFirestore('world', formData, fileMetadata);

      this.updateProgress('complete', 100, 'Submission completed successfully!');

      return {
        success: true,
        submissionId: docRef.id
      };

    } catch (error) {
      console.error('Submission error:', error);
      await this.cleanup();

      const submissionError = error as SubmissionError | FileUploadError;
      this.updateProgress('error', 0, submissionError.message);

      // Provide specific guidance for Firebase Storage permission errors
      let errorMessage = submissionError.message;
      if (submissionError.code === 'storage-unauthorized') {
        errorMessage = 'Firebase Storage permission error. Please ensure Storage rules allow read/write access. Contact support if this persists.';
      }

      return {
        success: false,
        error: errorMessage,
        errorCode: submissionError.code || 'unknown-error'
      };
    }
  }

  /**
   * Validates form data and files
   */
  private async validateFormData(formData: YouthFormData | FutureFormData | WorldFormData, isDraft: boolean = false): Promise<void> {
    // Validate user authentication
    if (!formData.userId) {
      throw new SubmissionError('User authentication required. Please sign in and try again.', 'missing-user-id', 'validation');
    }

    // For final submissions, validate required files
    if (!isDraft) {
      if (!formData.filmFile) {
        throw new SubmissionError('Film file is required', 'missing-film-file', 'validation');
      }
      if (!formData.posterFile) {
        throw new SubmissionError('Poster file is required', 'missing-poster-file', 'validation');
      }
      if (!formData.proofFile) {
        throw new SubmissionError('Proof file is required', 'missing-proof-file', 'validation');
      }

      // Validate each file
      const filmValidation = await validateFile(formData.filmFile, FILE_VALIDATION_RULES.film);
      if (!filmValidation.isValid) {
        throw new SubmissionError(`Film file validation failed: ${filmValidation.error}`, 'invalid-film-file', 'validation');
      }

      const posterValidation = await validateFile(formData.posterFile, FILE_VALIDATION_RULES.poster);
      if (!posterValidation.isValid) {
        throw new SubmissionError(`Poster file validation failed: ${posterValidation.error}`, 'invalid-poster-file', 'validation');
      }

      const proofValidation = await validateFile(formData.proofFile, FILE_VALIDATION_RULES.proof);
      if (!proofValidation.isValid) {
        throw new SubmissionError(`Proof file validation failed: ${proofValidation.error}`, 'invalid-proof-file', 'validation');
      }
    }
    // For drafts, files are optional - no file validation needed
  }

  /**
   * Uploads files for draft submissions (only uploads files that exist)
   */
  private async uploadFilesForDraft(
    formData: YouthFormData | FutureFormData | WorldFormData,
    submissionId: string
  ): Promise<{ [key: string]: FileMetadata }> {
    const fileProgress: { [key: string]: number } = {};
    const uploadRequests: FileUploadRequest[] = [];
    const result: { [key: string]: FileMetadata } = {};

    // Only add files that exist to upload requests
    if (formData.filmFile) {
      fileProgress.film = 0;
      uploadRequests.push({
        file: formData.filmFile,
        path: generateFilePath(submissionId, 'film', formData.filmFile.name),
        onProgress: (progress) => {
          fileProgress.film = progress;
          const totalProgress = Object.values(fileProgress).reduce((sum, p) => sum + p, 0) / Object.keys(fileProgress).length;
          this.updateProgress('uploading', 20 + (totalProgress * 0.5), 'Uploading files...', fileProgress);
        }
      });
    }

    if (formData.posterFile) {
      fileProgress.poster = 0;
      uploadRequests.push({
        file: formData.posterFile,
        path: generateFilePath(submissionId, 'poster', formData.posterFile.name),
        onProgress: (progress) => {
          fileProgress.poster = progress;
          const totalProgress = Object.values(fileProgress).reduce((sum, p) => sum + p, 0) / Object.keys(fileProgress).length;
          this.updateProgress('uploading', 20 + (totalProgress * 0.5), 'Uploading files...', fileProgress);
        }
      });
    }

    if (formData.proofFile) {
      fileProgress.proof = 0;
      uploadRequests.push({
        file: formData.proofFile,
        path: generateFilePath(submissionId, 'proof', formData.proofFile.name),
        onProgress: (progress) => {
          fileProgress.proof = progress;
          const totalProgress = Object.values(fileProgress).reduce((sum, p) => sum + p, 0) / Object.keys(fileProgress).length;
          this.updateProgress('uploading', 20 + (totalProgress * 0.5), 'Uploading files...', fileProgress);
        }
      });
    }

    try {
      if (uploadRequests.length > 0) {
        const uploadedFiles = await uploadMultipleFiles(uploadRequests);
        this.uploadedFiles = uploadedFiles;

        // Map uploaded files back to their types
        let fileIndex = 0;
        if (formData.filmFile) {
          result.filmFile = uploadedFiles[fileIndex++];
        }
        if (formData.posterFile) {
          result.posterFile = uploadedFiles[fileIndex++];
        }
        if (formData.proofFile) {
          result.proofFile = uploadedFiles[fileIndex++];
        }
      }

      return result;
    } catch (error) {
      throw new SubmissionError(
        `File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'upload-failed',
        'uploading'
      );
    }
  }

  /**
   * Uploads all files for a submission
   */
  private async uploadFiles(
    formData: YouthFormData | FutureFormData | WorldFormData,
    submissionId: string
  ): Promise<{ [key: string]: FileMetadata }> {
    const fileProgress: { [key: string]: number } = {
      film: 0,
      poster: 0,
      proof: 0
    };

    const updateFileProgress = (fileType: string, progress: number) => {
      fileProgress[fileType] = progress;
      const totalProgress = Object.values(fileProgress).reduce((sum, p) => sum + p, 0) / 3;
      this.updateProgress('uploading', 20 + (totalProgress * 0.6), 'Uploading files...', fileProgress);
    };

    const uploadRequests: FileUploadRequest[] = [
      {
        file: formData.filmFile!,
        path: generateFilePath(submissionId, 'film', formData.filmFile!.name),
        onProgress: (progress) => updateFileProgress('film', progress)
      },
      {
        file: formData.posterFile!,
        path: generateFilePath(submissionId, 'poster', formData.posterFile!.name),
        onProgress: (progress) => updateFileProgress('poster', progress)
      },
      {
        file: formData.proofFile!,
        path: generateFilePath(submissionId, 'proof', formData.proofFile!.name),
        onProgress: (progress) => updateFileProgress('proof', progress)
      }
    ];

    try {
      const uploadedFiles = await uploadMultipleFiles(uploadRequests);
      this.uploadedFiles = uploadedFiles;

      return {
        filmFile: uploadedFiles[0],
        posterFile: uploadedFiles[1],
        proofFile: uploadedFiles[2]
      };
    } catch (error) {
      throw new SubmissionError(
        `File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'upload-failed',
        'uploading'
      );
    }
  }

  /**
   * Saves submission data to Firestore
   */
  private async saveToFirestore(
    category: 'youth' | 'future' | 'world',
    formData: YouthFormData | FutureFormData | WorldFormData,
    fileMetadata: { [key: string]: FileMetadata }
  ) {
    try {
      const baseData = {
        // Metadata
        userId: formData.userId,
        applicationId: formData.applicationId || this.submissionId,
        competitionCategory: category,
        category,
        status: formData.status || 'submitted',
        submittedAt: serverTimestamp(),
        createdAt: formData.createdAt ? new Date(formData.createdAt) : serverTimestamp(),
        lastModified: serverTimestamp(),
        
        // Film data
        filmTitle: formData.filmTitle,
        filmTitleTh: (formData as YouthFormData).filmTitleTh || null,
        filmLanguages: formData.filmLanguages || ['Thai'],
        genres: formData.genres,
        format: formData.format,
        duration: parseInt(formData.duration),
        synopsis: formData.synopsis,
        chiangmaiConnection: formData.chiangmaiConnection,
        
        // Files
        files: {
          filmFile: {
            ...fileMetadata.filmFile,
            uploadedAt: serverTimestamp()
          },
          posterFile: {
            ...fileMetadata.posterFile,
            uploadedAt: serverTimestamp()
          },
          proofFile: {
            ...fileMetadata.proofFile,
            uploadedAt: serverTimestamp()
          }
        },
        
        // Agreements
        agreements: {
          copyright: formData.agreement1,
          terms: formData.agreement2,
          promotional: formData.agreement3,
          finalDecision: formData.agreement4
        }
      };

      let submissionData;

      if (category === 'youth' || category === 'future') {
        const typedFormData = formData as YouthFormData | FutureFormData;
        submissionData = {
          ...baseData,
          nationality: (typedFormData as YouthFormData).nationality || 'International',
          submitterName: (typedFormData as YouthFormData).submitterName || (typedFormData as FutureFormData).submitterName,
          submitterNameTh: (typedFormData as YouthFormData).submitterNameTh || (typedFormData as FutureFormData).submitterNameTh || null,
          submitterAge: parseInt((typedFormData as YouthFormData).submitterAge || (typedFormData as FutureFormData).submitterAge),
          submitterPhone: (typedFormData as YouthFormData).submitterPhone || (typedFormData as FutureFormData).submitterPhone,
          submitterEmail: (typedFormData as YouthFormData).submitterEmail || (typedFormData as FutureFormData).submitterEmail,
          submitterRole: (typedFormData as YouthFormData).submitterRole || (typedFormData as FutureFormData).submitterRole,
          submitterCustomRole: (typedFormData as YouthFormData).submitterCustomRole || (typedFormData as FutureFormData).submitterCustomRole || null,
          crewMembers: ((typedFormData as YouthFormData).crewMembers || (typedFormData as FutureFormData).crewMembers || []).map(member => ({
            fullName: member.fullName,
            fullNameTh: member.fullNameTh || null,
            role: member.role,
            customRole: member.customRole || null,
            phone: member.phone || null,
            email: member.email || null
          }))
        };

        if (category === 'youth') {
          const youthData = typedFormData as YouthFormData;
          submissionData = {
            ...submissionData,
            schoolName: youthData.schoolName,
            studentId: youthData.studentId
          };
        } else {
          const futureData = typedFormData as FutureFormData;
          submissionData = {
            ...submissionData,
            universityName: futureData.universityName,
            faculty: futureData.faculty,
            universityId: futureData.universityId
          };
        }
      } else {
        const worldData = formData as WorldFormData;
        submissionData = {
          ...baseData,
          submitterName: worldData.submitterName,
          submitterNameTh: worldData.submitterNameTh || null,
          submitterAge: parseInt(worldData.submitterAge),
          submitterPhone: worldData.submitterPhone,
          submitterEmail: worldData.submitterEmail,
          submitterRole: worldData.submitterRole,
          submitterCustomRole: worldData.submitterCustomRole || null,
          crewMembers: (worldData.crewMembers || []).map(member => ({
            fullName: member.fullName,
            fullNameTh: member.fullNameTh || null,
            role: member.role,
            customRole: member.customRole || null,
            age: member.age,
            phone: member.phone || null,
            email: member.email || null,
            schoolName: null,
            studentId: null
          }))
        };
      }

      return await addDoc(collection(db, 'submissions'), submissionData);
    } catch (error) {
      console.error('Firestore save error:', error);
      
      // Handle specific Firestore permission errors
      if (error instanceof Error) {
        if (error.message.includes('Missing or insufficient permissions') || 
            error.message.includes('permission-denied')) {
          throw new SubmissionError(
            'Database permission error. Please ensure Firestore rules allow write access to the submissions collection. Contact support if this persists.',
            'firestore-unauthorized',
            'saving'
          );
        }
      }
      
      throw new SubmissionError(
        `Failed to save submission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'firestore-error',
        'saving'
      );
    }
  }

  /**
   * Saves draft submission data to Firestore (with optional files)
   */
  private async saveDraftToFirestore(
    category: 'youth' | 'future' | 'world',
    formData: YouthFormData | FutureFormData | WorldFormData,
    fileMetadata?: { [key: string]: FileMetadata } | null
  ) {
    try {
      const baseData = {
        // Metadata
        userId: formData.userId,
        applicationId: formData.applicationId || this.submissionId,
        competitionCategory: category,
        category,
        status: 'draft',
        submittedAt: null, // No submission date for drafts
        createdAt: formData.createdAt ? new Date(formData.createdAt) : serverTimestamp(),
        lastModified: serverTimestamp(),
        
        // Film data (only what's available)
        filmTitle: formData.filmTitle || '',
        filmTitleTh: (formData as YouthFormData).filmTitleTh || null,
        filmLanguages: formData.filmLanguages || ['Thai'],
        genres: formData.genres || [],
        format: formData.format || '',
        duration: formData.duration ? parseInt(formData.duration) : null,
        synopsis: formData.synopsis || '',
        chiangmaiConnection: formData.chiangmaiConnection || '',
        
        // Files - use uploaded file data if available, otherwise set to null
        files: {
          filmFile: fileMetadata?.filmFile ? {
            ...fileMetadata.filmFile,
            uploadedAt: serverTimestamp()
          } : null,
          posterFile: fileMetadata?.posterFile ? {
            ...fileMetadata.posterFile,
            uploadedAt: serverTimestamp()
          } : null,
          proofFile: fileMetadata?.proofFile ? {
            ...fileMetadata.proofFile,
            uploadedAt: serverTimestamp()
          } : null
        },
        
        // Agreements
        agreements: {
          copyright: formData.agreement1 || false,
          terms: formData.agreement2 || false,
          promotional: formData.agreement3 || false,
          finalDecision: formData.agreement4 || false
        }
      };

      let submissionData;

      if (category === 'youth' || category === 'future') {
        const typedFormData = formData as YouthFormData | FutureFormData;
        submissionData = {
          ...baseData,
          nationality: (typedFormData as YouthFormData).nationality || 'International',
          submitterName: (typedFormData as YouthFormData).submitterName || (typedFormData as FutureFormData).submitterName || '',
          submitterNameTh: (typedFormData as YouthFormData).submitterNameTh || (typedFormData as FutureFormData).submitterNameTh || null,
          submitterAge: ((typedFormData as YouthFormData).submitterAge || (typedFormData as FutureFormData).submitterAge) ? parseInt((typedFormData as YouthFormData).submitterAge || (typedFormData as FutureFormData).submitterAge) : null,
          submitterPhone: (typedFormData as YouthFormData).submitterPhone || (typedFormData as FutureFormData).submitterPhone || '',
          submitterEmail: (typedFormData as YouthFormData).submitterEmail || (typedFormData as FutureFormData).submitterEmail || '',
          submitterRole: (typedFormData as YouthFormData).submitterRole || (typedFormData as FutureFormData).submitterRole || '',
          submitterCustomRole: (typedFormData as YouthFormData).submitterCustomRole || (typedFormData as FutureFormData).submitterCustomRole || null,
          crewMembers: ((typedFormData as YouthFormData).crewMembers || (typedFormData as FutureFormData).crewMembers || []).map(member => ({
            fullName: member.fullName,
            fullNameTh: member.fullNameTh || null,
            role: member.role,
            customRole: member.customRole || null,
            phone: member.phone || null,
            email: member.email || null
          }))
        };

        if (category === 'youth') {
          const youthData = typedFormData as YouthFormData;
          submissionData = {
            ...submissionData,
            schoolName: youthData.schoolName || '',
            studentId: youthData.studentId || ''
          };
        } else {
          const futureData = typedFormData as FutureFormData;
          submissionData = {
            ...submissionData,
            universityName: futureData.universityName || '',
            faculty: futureData.faculty || '',
            universityId: futureData.universityId || ''
          };
        }
      } else {
        const worldData = formData as WorldFormData;
        submissionData = {
          ...baseData,
          submitterName: worldData.submitterName || '',
          submitterNameTh: worldData.submitterNameTh || null,
          submitterAge: worldData.submitterAge ? parseInt(worldData.submitterAge) : null,
          submitterPhone: worldData.submitterPhone || '',
          submitterEmail: worldData.submitterEmail || '',
          submitterRole: worldData.submitterRole || '',
          submitterCustomRole: worldData.submitterCustomRole || null,
          crewMembers: (worldData.crewMembers || []).map(member => ({
            fullName: member.fullName,
            fullNameTh: member.fullNameTh || null,
            role: member.role,
            customRole: member.customRole || null,
            age: member.age,
            phone: member.phone || null,
            email: member.email || null,
            schoolName: null,
            studentId: null
          }))
        };
      }

      return await addDoc(collection(db, 'submissions'), submissionData);
    } catch (error) {
      console.error('Firestore draft save error:', error);
      
      // Handle specific Firestore permission errors
      if (error instanceof Error) {
        if (error.message.includes('Missing or insufficient permissions') || 
            error.message.includes('permission-denied')) {
          throw new SubmissionError(
            'Database permission error. Please ensure Firestore rules allow write access to the submissions collection. Contact support if this persists.',
            'firestore-unauthorized',
            'saving'
          );
        }
      }
      
      throw new SubmissionError(
        `Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'firestore-error',
        'saving'
      );
    }
  }

  /**
   * Cleans up uploaded files in case of error
   */
  private async cleanup(): Promise<void> {
    if (this.uploadedFiles.length > 0) {
      try {
        await Promise.all(
          this.uploadedFiles.map(file => deleteFile(file.storagePath))
        );
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  }

  /**
   * Updates progress callback
   */
  private updateProgress(
    stage: SubmissionProgress['stage'],
    progress: number,
    message: string,
    fileProgress?: { [key: string]: number }
  ): void {
    this.onProgress?.({
      stage,
      progress,
      message,
      fileProgress
    });
  }
}
