import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
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
  files: {
    posterFile: {
      downloadURL: string;
      fileName: string;
    };
  };
  submittedAt?: any;
  createdAt: any;
  lastModified: any;
}

interface MyApplicationsPageProps {
  onSidebarToggle?: () => void;
}

const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({ onSidebarToggle }) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch user's applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'submissions'),
          where('userId', '==', user.uid),
          where('status', 'in', ['draft', 'submitted']),
          orderBy('lastModified', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const applicationsData: ApplicationData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          applicationsData.push({
            id: doc.id,
            userId: data.userId,
            applicationId: data.applicationId || doc.id,
            competitionCategory: data.competitionCategory || data.category,
            status: data.status,
            filmTitle: data.filmTitle,
            filmTitleTh: data.filmTitleTh,
           filmLanguages: data.filmLanguages || (data.filmLanguage ? [data.filmLanguage] : []), // Backward compatibility
            files: {
              posterFile: {
                downloadURL: data.files?.posterFile?.downloadURL || data.files?.posterFile?.url || '',
                fileName: data.files?.posterFile?.fileName || data.files?.posterFile?.name || ''
              }
            },
            submittedAt: data.submittedAt,
            createdAt: data.createdAt,
            lastModified: data.lastModified
          });
        });

        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, currentLanguage]);

  const content = {
    th: {
      pageTitle: "ใบสมัครของฉัน",
      subtitle: "จัดการและติดตามสถานะใบสมัครของคุณ",
      noApplications: "ยังไม่มีใบสมัคร",
      noApplicationsDesc: "คุณยังไม่ได้ส่งใบสมัครเข้าประกวด",
      createFirst: "สร้างใบสมัครแรก",
      loading: "กำลังโหลด...",
      draft: "ร่าง",
      submitted: "ส่งแล้ว",
      lastModified: "แก้ไขล่าสุด",
      submittedOn: "ส่งเมื่อ",
      viewDetails: "ดูรายละเอียด",
      editApplication: "แก้ไขใบสมัคร",
      categories: {
        youth: "เยาวชน",
        future: "อนาคต", 
        world: "โลก"
      }
    },
    en: {
      pageTitle: "My Applications",
      subtitle: "Manage and track your submission status",
      noApplications: "No Applications Yet",
      noApplicationsDesc: "You haven't submitted any applications to the competition",
      createFirst: "Create Your First Application",
      loading: "Loading...",
      draft: "Draft",
      submitted: "Submitted",
      lastModified: "Last Modified",
      submittedOn: "Submitted",
      viewDetails: "View Details",
      editApplication: "Edit Application",
      categories: {
        youth: "Youth",
        future: "Future",
        world: "World"
      }
    }
  };

  const currentContent = content[currentLanguage];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLogo = (category: string) => {
    const logos = {
      youth: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689",
      future: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287",
      world: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
    };
    return logos[category as keyof typeof logos];
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <UserZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
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
      <div className="space-y-6 sm:space-y-8">
        <UserZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
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

  // Empty State
  if (applications.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <UserZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📄</div>
          <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
            {currentContent.noApplications}
          </h2>
          <p className={`${getClass('body')} text-white/80 mb-8 max-w-md mx-auto`}>
            {currentContent.noApplicationsDesc}
          </p>
          <AnimatedButton
            variant="primary"
            size="medium"
            icon="🎬"
            onClick={() => {
              window.location.hash = '#competition';
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            {currentContent.createFirst}
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Zone Header */}
      <UserZoneHeader
        title={currentContent.pageTitle}
        subtitle={currentContent.subtitle}
        onSidebarToggle={onSidebarToggle || (() => {})}
      >
        <AnimatedButton
          variant="primary"
          size="medium"
          icon="🎬"
          onClick={() => {
            window.location.hash = '#competition';
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
          }}
        >
          {currentLanguage === 'th' ? 'สมัครเพิ่ม' : 'Apply More'}
        </AnimatedButton>
      </UserZoneHeader>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {applications.map((application) => (
          <div
            key={application.id}
            className="group cursor-pointer"
            onClick={() => {
              window.location.hash = `#application-detail/${application.id}`;
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
          >
            {/* Application Card with Full Poster */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-[#FCB283]/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
              
              {/* Full Poster Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {application.files.posterFile.downloadURL ? (
                  <img
                    src={application.files.posterFile.downloadURL}
                    alt={`${application.filmTitle} Poster`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex flex-col items-center justify-center text-white/60 bg-white/5">
                            <div class="text-4xl mb-2">🖼️</div>
                            <div class="text-sm text-center px-4">
                              ${currentLanguage === 'th' ? 'ไม่สามารถโหลดโปสเตอร์ได้' : 'Poster not available'}
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/60 bg-white/5">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div className="text-sm text-center px-4">
                      {currentLanguage === 'th' ? 'ไม่มีโปสเตอร์' : 'No poster available'}
                    </div>
                  </div>
                )}
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Status Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    application.status === 'submitted' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {application.status === 'submitted' ? currentContent.submitted : currentContent.draft}
                  </span>
                </div>

                {/* Category Logo - Top Left */}
                <div className="absolute top-3 left-3">
                  <img
                    src={getCategoryLogo(application.competitionCategory)}
                    alt={`${application.competitionCategory} logo`}
                    className="h-8 w-auto object-contain opacity-90"
                  />
                </div>

                {/* Text Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Film Title */}
                  <h3 className={`text-lg sm:text-xl ${getClass('header')} text-white mb-2 leading-tight line-clamp-2`}>
                    {currentLanguage === 'th' && application.filmTitleTh 
                      ? application.filmTitleTh 
                      : application.filmTitle}
                  </h3>
                  
                  {/* Category */}
                  <p className={`text-sm ${getClass('subtitle')} text-[#FCB283] mb-1`}>
                    {currentContent.categories[application.competitionCategory]}
                  </p>
                  
                  {/* Last Updated Date */}
                  <p className={`text-xs ${getClass('body')} text-white/80`}>
                    {application.status === 'submitted' ? currentContent.submittedOn : currentContent.lastModified}: {' '}
                    {formatDate(application.status === 'submitted' ? application.submittedAt : application.lastModified)}
                  </p>

                  {/* Action Buttons - Hidden by default, shown on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.hash = `#application-detail/${application.id}`;
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      className="w-8 h-8 bg-blue-500/80 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors"
                      title={currentContent.viewDetails}
                    >
                      👁️
                    </button>
                    
                    {application.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.hash = `#application-edit/${application.id}`;
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                        }}
                        className="w-8 h-8 bg-orange-500/80 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-colors"
                        title={currentContent.editApplication}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
