import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ApplicationLayout from '../applications/ApplicationLayout';
import AnimatedButton from '../ui/AnimatedButton';
import UserZoneHeader from '../layout/UserZoneHeader';

interface ApplicationData {
  id: string;
  userId: string;
  applicationId: string;
  competitionCategory: 'youth' | 'future' | 'world';
  status: 'draft' | 'submitted';
  filmTitle: string;
  filmTitleTh?: string;
  filmLanguages?: string[];
  genres: string[];
  format: string;
  duration: number;
  synopsis: string;
  files: {
    filmFile: {
      url: string;
      name: string;
      size: number;
    };
    posterFile: {
      url: string;
      name: string;
      size: number;
    };
    proofFile?: {
      url: string;
      name: string;
      size: number;
    };
  };
  submittedAt: any;
  createdAt: any;
  lastModified: any;
}

interface ApplicationDetailPageProps {
  applicationId: string;
}

interface ApplicationDetailPageProps {
  applicationId: string;
  onSidebarToggle?: () => void;
}

const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({ 
  applicationId, 
  onSidebarToggle 
}) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      if (!user || !applicationId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'submissions', applicationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Verify that this application belongs to the current user
          if (data.userId !== user.uid) {
            setError(currentLanguage === 'th' ? 'คุณไม่มีสิทธิ์เข้าถึงใบสมัครนี้' : 'You do not have permission to access this application');
            return;
          }

          // Set application data with proper structure
          setApplication({
            id: docSnap.id,
            userId: data.userId,
            applicationId: data.applicationId || docSnap.id,
            competitionCategory: data.competitionCategory || data.category,
            status: data.status || 'draft',
            filmTitle: data.filmTitle,
            filmTitleTh: data.filmTitleTh,
            filmLanguages: data.filmLanguages || data.filmLanguage ? [data.filmLanguage] : ['Thai'], // Backward compatibility
            genres: data.genres || [],
            format: data.format,
            duration: data.duration,
            synopsis: data.synopsis,
            chiangmaiConnection: data.chiangmaiConnection,
            // Submitter/Director data
            submitterName: data.submitterName || data.directorName,
            submitterNameTh: data.submitterNameTh || data.directorNameTh,
            submitterAge: data.submitterAge || data.directorAge,
            submitterPhone: data.submitterPhone || data.directorPhone,
            submitterEmail: data.submitterEmail || data.directorEmail,
            submitterRole: data.submitterRole || data.directorRole,
            submitterCustomRole: data.submitterCustomRole || data.directorCustomRole,
            // Education data
            schoolName: data.schoolName,
            studentId: data.studentId,
            universityName: data.universityName,
            faculty: data.faculty,
            universityId: data.universityId,
            // Crew members
            crewMembers: data.crewMembers || [],
            files: {
              filmFile: {
                url: data.files?.filmFile?.downloadURL || data.files?.filmFile?.url || '',
                name: data.files?.filmFile?.fileName || data.files?.filmFile?.name || '',
                size: data.files?.filmFile?.fileSize || data.files?.filmFile?.size || 0
              },
              posterFile: {
                url: data.files?.posterFile?.downloadURL || data.files?.posterFile?.url || '',
                name: data.files?.posterFile?.fileName || data.files?.posterFile?.name || '',
                size: data.files?.posterFile?.fileSize || data.files?.posterFile?.size || 0
              },
              proofFile: data.files?.proofFile ? {
                url: data.files?.proofFile?.downloadURL || data.files?.proofFile?.url || '',
                name: data.files?.proofFile?.fileName || data.files?.proofFile?.name || '',
                size: data.files?.proofFile?.fileSize || data.files?.proofFile?.size || 0
              } : undefined
            },
            submittedAt: data.submittedAt,
            createdAt: data.createdAt,
            lastModified: data.lastModified
          } as ApplicationData);
          
          console.log('Application data loaded:', {
            id: docSnap.id,
            filmTitle: data.filmTitle,
            posterUrl: data.files?.posterFile?.downloadURL,
            filmUrl: data.files?.filmFile?.downloadURL,
            crewCount: data.crewMembers?.length || 0
          });
        } else {
          setError(currentLanguage === 'th' ? 'ไม่พบใบสมัครที่ระบุ' : 'Application not found');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user, applicationId, currentLanguage]);

  const content = {
    th: {
      loading: "กำลังโหลด...",
      applicationDetails: "รายละเอียดใบสมัคร",
      editApplication: "แก้ไขใบสมัคร"
    },
    en: {
      loading: "Loading...",
      applicationDetails: "Application Details",
      editApplication: "Edit Application"
    }
  };

  const currentContent = content[currentLanguage];

  // Loading State
  if (loading) {
    return (
      <div className="space-y-8">
        <UserZoneHeader
          title={currentContent.applicationDetails}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
          <p className={`${getClass('body')} text-white/80`}>
            {currentContent.loading}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-8">
        <UserZoneHeader
          title={currentContent.applicationDetails}
          showBackButton={true}
          onBackClick={() => window.location.hash = '#my-applications'}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {error}
          </h2>
        </div>
      </div>
    );
  }

  // No Application State
  if (!application) {
    return (
      <div className="space-y-8">
        <UserZoneHeader
          title={currentContent.applicationDetails}
          showBackButton={true}
          onBackClick={() => window.location.hash = '#my-applications'}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📄</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {currentLanguage === 'th' ? 'ไม่พบใบสมัคร' : 'Application Not Found'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Zone Header */}
      <UserZoneHeader
        title={application.filmTitle}
        subtitle={currentContent.applicationDetails}
        showBackButton={true}
        backButtonText={currentLanguage === 'th' ? 'กลับไปรายการ' : 'Back to List'}
        onBackClick={() => window.location.hash = '#my-applications'}
        onSidebarToggle={onSidebarToggle || (() => {})}
      >
        {/* Edit Button - Only show for draft applications */}
        {application.status === 'draft' && (
          <AnimatedButton
            variant="secondary"
            size="medium"
            icon="✏️"
            onClick={() => {
              window.location.hash = `#application-edit/${application.id}`;
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            {currentContent.editApplication}
          </AnimatedButton>
        )}
      </UserZoneHeader>

      {/* Application Layout */}
      <ApplicationLayout application={application} />
    </div>
  );
};

export default ApplicationDetailPage;
