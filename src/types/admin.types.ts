export interface AdminZoneLayoutProps {
  currentPage: string;
  children: React.ReactNode;
}

export interface AdminZoneSidebarProps {
  currentPage: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export interface AdminMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: {
    text: string;
    color: 'orange' | 'blue' | 'green' | 'red';
  };
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'super-admin';
  permissions: string[];
}

export interface AdminProfile {
  uid: string;
  email: string;
  emailVerified: boolean;
  photoURL?: string;
  fullNameEN: string;
  fullNameTH?: string;
  birthDate: Date;
  age: number;
  phoneNumber: string;
  
  // Admin-specific fields
  adminRole: 'admin' | 'super-admin' | 'moderator';
  adminLevel: 'junior' | 'senior' | 'lead' | 'director';
  department: string;
  responsibility: string;
  adminSince: Date;
  permissions: AdminPermission[];
  lastActiveAt: Date;
  
  // Profile management
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminPermissions {
  canViewDashboard: boolean;
  canViewApplications: boolean;
  canScoreApplications: boolean;
  canApproveApplications: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canAccessSystemSettings: boolean;
  canGenerateReports: boolean;
  canFlagApplications: boolean;
  canDeleteApplications: boolean;
  canEditApplications: boolean;
}

export interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminLevel: 'viewer' | 'scorer' | 'manager' | 'super';
  permissions: AdminPermissions;
  adminProfile: AdminProfile | null;
  checkPermission: (permission: keyof AdminPermissions) => boolean;
  hasAnyPermission: (permissions: (keyof AdminPermissions)[]) => boolean;
  refreshAdminData: () => Promise<void>;
}

export interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof AdminPermissions;
  requiredPermissions?: (keyof AdminPermissions)[];
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: 'applications' | 'users' | 'content' | 'system' | 'reports';
  granted: boolean;
}

export interface AdminProfileFormData {
  fullNameEN: string;
  fullNameTH?: string;
  birthDate: string;
  phoneNumber: string;
  department: string;
  responsibility: string;
  photoFile?: File;
}

export interface AdminProfileFormErrors {
  fullNameEN?: string;
  fullNameTH?: string;
  birthDate?: string;
  phoneNumber?: string;
  department?: string;
  responsibility?: string;
  photoFile?: string;
}

export interface DashboardStats {
  totalApplications: number;
  applicationsByCategory: {
    youth: number;
    future: number;
    world: number;
  };
  applicationsByStatus: {
    draft: number;
    submitted: number;
  };
  recentSubmissions: number;
  trends: {
    category: string;
    change: number;
    isPositive: boolean;
  }[];
}

export interface DashboardStatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme: 'youth' | 'future' | 'world' | 'primary' | 'success' | 'warning' | 'info';
  className?: string;
  onClick?: () => void;
}

export interface CategoryBannerCardProps {
  category: 'youth' | 'future' | 'world';
  title: string;
  subtitle: string;
  count: number;
  percentage: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
  logo: string;
  onClick?: () => void;
}

// Chart Data Interfaces
export interface GenreStats {
  genre: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CountryStats {
  country: string;
  count: number;
  flag?: string;
  code: string;
}

export interface TrendData {
  date: string;
  youth: number;
  future: number;
  world: number;
  total: number;
  dateFormatted: string;
}

export interface AdminApplicationCard {
  id: string;
  userId: string;
  filmTitle: string;
  filmTitleTh?: string;
  directorName: string;
  directorNameTh?: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected';
  posterUrl: string;
  submittedAt?: Date;
  createdAt: Date;
  lastModified: Date;
  country: string;
  hasScores?: boolean;
  reviewStatus?: 'pending' | 'in-progress' | 'completed';
  averageScore?: number;
  genres: string[];
  duration: number;
  format: 'live-action' | 'animation';
}

export interface GalleryFilters {
  category: 'all' | 'youth' | 'future' | 'world';
  status: 'all' | 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected';
  dateRange: {
    start?: string;
    end?: string;
  };
  search: string;
  sortBy: 'newest' | 'oldest' | 'alphabetical' | 'category' | 'status';
  country: 'all' | string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
}

// Admin Application Details and Scoring
export interface ScoringCriteria {
  technical: number;      // 1-10
  story: number;         // 1-10  
  creativity: number;    // 1-10
  chiangmai: number;     // 1-10
  overall: number;       // 1-10
  totalScore: number;    // calculated (0-50)
  adminId: string;
  adminName: string;
  scoredAt: Date;
  comments?: string;
}

export interface AdminApplicationData {
  // Base application data
  id: string;
  userId: string;
  applicationId: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected';
  filmTitle: string;
  filmTitleTh?: string;
  genres: string[];
  format: string;
  duration: number;
  synopsis: string;
  chiangmaiConnection?: string;
  
  // Submitter/Director data
  submitterName?: string;
  submitterNameTh?: string;
  submitterAge?: number;
  submitterPhone?: string;
  submitterEmail?: string;
  submitterRole?: string;
  
  // Files
  files: {
    filmFile: { url: string; name: string; size: number; };
    posterFile: { url: string; name: string; size: number; };
    proofFile?: { url: string; name: string; size: number; };
  };
  
  // Admin-specific data
  scores: ScoringCriteria[];
  adminNotes: string;
  reviewStatus: 'pending' | 'in-progress' | 'reviewed' | 'approved' | 'rejected';
  flagged: boolean;
  flagReason?: string;
  assignedReviewers: string[];
  
  // Timestamps
  submittedAt?: Date;
  createdAt: Date;
  lastModified: Date;
  lastReviewedAt?: Date;
}

export interface VideoScoringPanelProps {
  applicationId: string;
  currentScores?: ScoringCriteria;
  allScores: ScoringCriteria[];
  onScoreChange: (scores: Partial<ScoringCriteria>) => void;
  onSaveScores: (scores: ScoringCriteria) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export interface AdminControlsPanelProps {
  application: AdminApplicationData;
  onStatusChange: (status: AdminApplicationData['reviewStatus']) => Promise<void>;
  onNotesChange: (notes: string) => Promise<void>;
  onFlagToggle: (flagged: boolean, reason?: string) => Promise<void>;
  onExport: () => void;
  onPrint: () => void;
  isUpdating?: boolean;
}