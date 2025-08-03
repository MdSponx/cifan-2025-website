export interface FormErrors {
  [key: string]: string;
}

export interface FileUploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface SubmissionState {
  isSubmitting: boolean;
  progress?: import('../services/submissionService').SubmissionProgress;
  result?: import('../services/submissionService').SubmissionResult;
}

export interface BaseFormData {
  // User Information
  userId?: string;
  applicationId?: string;
  
  // Film Information
  filmTitle: string;
  filmTitleTh?: string;
  filmTitleEn?: string;
  filmLanguages: string[];
  genres: string[];
  format: 'live-action' | 'animation' | '';
  duration: string;
  synopsis: string;
  chiangmaiConnection: string;
  
  // Submission Status
  status?: 'draft' | 'submitted';
  createdAt?: Date;
  lastModified?: Date;
  
  // Agreements
  agreement1: boolean;
  agreement2: boolean;
  agreement3: boolean;
  agreement4: boolean;
}

export interface YouthFormData extends BaseFormData {
  nationality: string;
  filmLanguages: string[];
  
  // Submitter Information
  submitterName: string;
  submitterNameTh?: string;
  submitterAge: string;
  submitterPhone: string;
  submitterEmail: string;
  submitterRole: string;
  submitterCustomRole?: string;
  schoolName: string;
  studentId: string;
  
  // Crew Information
  crewMembers: CrewMember[];
  
  // Files
  filmFile: File | null;
  posterFile: File | null;
  proofFile: File | null;
}

export interface WorldFormData extends BaseFormData {
  filmLanguages: string[];
  
  // Submitter Information
  submitterName: string;
  submitterNameTh?: string;
  submitterAge: string;
  submitterPhone: string;
  submitterEmail: string;
  submitterRole: string;
  submitterCustomRole?: string;
  
  // Crew Information
  crewMembers: CrewMember[];
  
  // Files
  filmFile: File | null;
  posterFile: File | null;
  proofFile: File | null;
}

export interface FutureFormData extends BaseFormData {
  nationality: string;
  filmLanguages: string[];
  
  // Submitter Information
  submitterName: string;
  submitterNameTh?: string;
  submitterAge: string;
  submitterPhone: string;
  submitterEmail: string;
  submitterRole: string;
  submitterCustomRole?: string;
  universityName: string;
  faculty: string;
  universityId: string;
  
  // Crew Information
  crewMembers: CrewMember[];
  
  // Files
  filmFile: File | null;
  posterFile: File | null;
  proofFile: File | null;
}

export interface CrewMember {
  id: string;
  fullName: string;
  fullNameTh?: string;
  role: string;
  customRole?: string;
  age: number;
  phone?: string;
  email?: string;
  schoolName: string;
  studentId: string;
}

export interface CrewFormData {
  fullName: string;
  fullNameTh: string;
  role: string;
  customRole: string;
  age: string;
  phone: string;
  email: string;
  schoolName: string;
  studentId: string;
}

export interface GenreOption {
  value: string;
  label: {
    th: string;
    en: string;
  };
}

export interface FileUploadProps {
  name: string;
  label: string;
  accept: string;
  required?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
  onFileChange: (file: File | null) => void;
  error?: string;
  currentFile?: File | null;
  className?: string;
}

export interface AgreementCheckboxProps {
  agreements: {
    agreement1: boolean;
    agreement2: boolean;
    agreement3: boolean;
    agreement4: boolean;
  };
  onChange: (name: string, checked: boolean) => void;
  error?: string;
  className?: string;
}

export type FormCategory = 'youth' | 'world' | 'future';
export type AgeCategory = 'YOUTH' | 'FUTURE' | 'WORLD';
export type Language = 'th' | 'en';
