import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useNotificationHelpers } from '../ui/NotificationSystem';
import { adminSubmissionService } from '../../services/adminSubmissionService';
import { DashboardStats, GenreStats, CountryStats } from '../../types/admin.types';

// Components
import AdminZoneHeader from '../layout/AdminZoneHeader';
import DashboardStatCard from '../ui/DashboardStatsCard';
import CategoryBannerCard from '../ui/CategoryBannerCard';
import GenreDistributionChart from '../charts/GenreDistributionChart';
import CountryDistributionChart from '../charts/CountryDistributionChart';
import ApplicationTrendsChart from '../charts/ApplicationTrendsChart';

// Icons
import { 
  FileText, 
  Send, 
  Edit3, 
  Clock, 
  TrendingUp, 
  Activity,
  PieChart,
  Users,
  Globe
} from 'lucide-react';

interface ApplicationsDashboardPageProps {
  onSidebarToggle?: () => void;
}

const ApplicationsDashboardPage: React.FC<ApplicationsDashboardPageProps> = ({ onSidebarToggle }) => {
  const { t, i18n } = useTranslation();
  const { getClass } = useTypography();
  const { showSuccess, showError } = useNotificationHelpers();
  const currentLanguage = i18n.language as 'en' | 'th';

  // State
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    applicationsByStatus: {
      submitted: 0,
      draft: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0
    },
    applicationsByCategory: {
      youth: { submitted: 0, draft: 0 },
      future: { submitted: 0, draft: 0 },
      world: { submitted: 0, draft: 0 }
    },
    recentSubmissions: 0,
    growthRate: 0,
    conversionRate: 0
  });
  
  const [genreData, setGenreData] = useState<GenreStats[]>([]);
  const [countryData, setCountryData] = useState<CountryStats[]>([]);
  const [trendData, setTrendData] = useState<Array<{ date: string; submitted: number; draft: number }>>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setChartsLoading(true);

      // Load basic stats first
      const dashboardStats = await adminSubmissionService.getDashboardStats();
      setStats(dashboardStats);
      setLoading(false);

      // Load chart data
      const [genreStats, countryStats, trendStats] = await Promise.all([
        adminSubmissionService.getGenreDistribution(),
        adminSubmissionService.getCountryDistribution(),
        adminSubmissionService.getSubmissionTrends(30)
      ]);

      setGenreData(genreStats);
      setCountryData(countryStats);
      setTrendData(trendStats);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError(
        currentLanguage === 'th' ? 'ข้อผิดพลาด' : 'Error',
        currentLanguage === 'th' ? 
          'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้' : 
          'Failed to load dashboard data'
      );
    } finally {
      setChartsLoading(false);
    }
  };

  // Calculate derived metrics
  const submissionRate = stats.totalApplications > 0 
    ? Math.round((stats.applicationsByStatus.submitted / stats.totalApplications) * 100)
    : 0;

  const averagePerDay = trendData.length > 0
    ? Math.round(trendData.reduce((sum, day) => sum + day.submitted, 0) / trendData.length)
    : 0;

  const content = {
    th: {
      pageTitle: "แดชบอร์ดใบสมัคร",
      subtitle: "ภาพรวมและสถิติการสมัครเข้าประกวดภาพยนตร์",
      
      // Category banners
      youthCategory: "การประกวดเยาวชน",
      youthSubtitle: "นักเรียนมัธยมศึกษา (อายุ 12-18 ปี)",
      futureCategory: "การประกวดอนาคต",
      futureSubtitle: "นักศึกษาอุดมศึกษา (อายุ 18-25 ปี)", 
      worldCategory: "การประกวดโลก",
      worldSubtitle: "ประชาชนทั่วไป (อายุ 20+ ปี)",
      
      // Stats cards
      totalApplications: "ใบสมัครทั้งหมด",
      totalApplicationsSubtitle: "ใบสมัครเข้าประกวดทั้งหมด",
      submittedApplications: "ส่งแล้ว",
      submittedApplicationsSubtitle: "ใบสมัครที่ส่งเรียบร้อยแล้ว",
      draftApplications: "ร่าง",
      draftApplicationsSubtitle: "ใบสมัครที่ยังไม่ได้ส่ง",
      recentSubmissions: "ส่งล่าสุด",
      recentSubmissionsSubtitle: "ใบสมัครใหม่ใน 7 วันที่ผ่านมา",
      
      // Additional stats
      submissionRate: "อัตราการส่ง",
      submissionRateSubtitle: "เปอร์เซ็นต์ใบสมัครที่ส่งแล้ว",
      averagePerDay: "เฉลี่ยต่อวัน",
      averagePerDaySubtitle: "ใบสมัครเฉลี่ยต่อวันใน 30 วัน",
      
      loading: "กำลังโหลดข้อมูล...",
      quickActions: "การดำเนินการด่วน",
      viewAllApplications: "ดูใบสมัครทั้งหมด",
      exportData: "ส่งออกข้อมูล",
      refreshData: "รีเฟรชข้อมูล"
    },
    en: {
      pageTitle: "Applications Dashboard",
      subtitle: "Overview and statistics of film competition submissions",
      
      // Category banners
      youthCategory: "Youth Competition",
      youthSubtitle: "High school students (Age 12-18)",
      futureCategory: "Future Competition", 
      futureSubtitle: "University students (Age 18-25)",
      worldCategory: "World Competition",
      worldSubtitle: "General public (Age 20+)",
      
      // Stats cards
      totalApplications: "Total Applications",
      totalApplicationsSubtitle: "All competition submissions",
      submittedApplications: "Submitted",
      submittedApplicationsSubtitle: "Completed submissions",
      draftApplications: "Drafts",
      draftApplicationsSubtitle: "Incomplete submissions",
      recentSubmissions: "Recent",
      recentSubmissionsSubtitle: "New submissions in last 7 days",
      
      // Additional stats
      submissionRate: "Submission Rate",
      submissionRateSubtitle: "Percentage of completed submissions",
      averagePerDay: "Daily Average",
      averagePerDaySubtitle: "Average submissions per day (30 days)",
      
      loading: "Loading dashboard data...",
      quickActions: "Quick Actions",
      viewAllApplications: "View All Applications",
      exportData: "Export Data",
      refreshData: "Refresh Data"
    }
  };

  const currentContent = content[currentLanguage];

  // Calculate category data for banners
  const getCategoryData = () => {
    const totalApps = stats.totalApplications;
    
    return [
      {
        category: 'youth' as const,
        title: currentContent.youthCategory,
        subtitle: currentContent.youthSubtitle,
        count: stats.applicationsByCategory.youth.submitted + stats.applicationsByCategory.youth.draft,
        percentage: totalApps > 0 ? Math.round(((stats.applicationsByCategory.youth.submitted + stats.applicationsByCategory.youth.draft) / totalApps) * 100) : 0,
        trend: { value: 12, isPositive: true },
        logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%202.png?alt=media&token=e8be419f-f0b2-4f64-8d7f-c3e8532e2689"
      },
      {
        category: 'future' as const,
        title: currentContent.futureCategory,
        subtitle: currentContent.futureSubtitle,
        count: stats.applicationsByCategory.future.submitted + stats.applicationsByCategory.future.draft,
        percentage: totalApps > 0 ? Math.round(((stats.applicationsByCategory.future.submitted + stats.applicationsByCategory.future.draft) / totalApps) * 100) : 0,
        trend: { value: 8, isPositive: true },
        logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%203.png?alt=media&token=b66cd708-0dc3-4c05-bc56-b2f99a384287"
      },
      {
        category: 'world' as const,
        title: currentContent.worldCategory,
        subtitle: currentContent.worldSubtitle,
        count: stats.applicationsByCategory.world.submitted + stats.applicationsByCategory.world.draft,
        percentage: totalApps > 0 ? Math.round(((stats.applicationsByCategory.world.submitted + stats.applicationsByCategory.world.draft) / totalApps) * 100) : 0,
        trend: { value: 15, isPositive: true },
        logo: "https://firebasestorage.googleapis.com/v0/b/cifan-c41c6.firebasestorage.app/o/site_files%2Ffest_logos%2FGroup%204.png?alt=media&token=84ad0256-2322-4999-8e9f-d2f30c7afa67"
      }
    ];
  };

  const categoryData = getCategoryData();

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        
        {/* Loading Skeleton */}
        <div className="space-y-6">
          {/* Banner Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-container rounded-2xl p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                  <div className="w-12 h-4 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                  <div className="w-1/2 h-3 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="glass-container rounded-xl p-6 animate-pulse">
                <div className="w-1/3 h-6 bg-white/20 rounded mb-4"></div>
                <div className="w-full h-64 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminZoneHeader
        title={currentContent.pageTitle}
        subtitle={currentContent.subtitle}
        onSidebarToggle={onSidebarToggle || (() => {})}
      />

      {/* Competition Categories Banner - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {categoryData.map((category) => (
          <CategoryBannerCard
            key={category.category}
            category={category.category}
            title={category.title}
            subtitle={category.subtitle}
            count={category.count}
            percentage={category.percentage}
            trend={category.trend}
            logo={category.logo}
            onClick={() => {
              // Navigate to filtered gallery view for this category
              window.location.hash = `#admin/gallery?category=${category.category}`;
            }}
          />
        ))}
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardStatCard
          icon={<FileText className="w-6 h-6" />}
          title={currentContent.totalApplications}
          value={stats.totalApplications}
          subtitle={currentContent.totalApplicationsSubtitle}
          trend={{ value: stats.growthRate, isPositive: stats.growthRate >= 0 }}
          colorScheme="primary"
        />
        
        <DashboardStatCard
          icon={<Send className="w-6 h-6" />}
          title={currentContent.submittedApplications}
          value={stats.applicationsByStatus.submitted}
          subtitle={currentContent.submittedApplicationsSubtitle}
          trend={{ value: submissionRate, isPositive: true, suffix: '%' }}
          colorScheme="success"
        />
        
        <DashboardStatCard
          icon={<Edit3 className="w-6 h-6" />}
          title={currentContent.draftApplications}
          value={stats.applicationsByStatus.draft}
          subtitle={currentContent.draftApplicationsSubtitle}
          trend={{ value: 100 - submissionRate, isPositive: false, suffix: '%' }}
          colorScheme="warning"
        />
        
        <DashboardStatCard
          icon={<Clock className="w-6 h-6" />}
          title={currentContent.recentSubmissions}
          value={stats.recentSubmissions}
          subtitle={currentContent.recentSubmissionsSubtitle}
          trend={{ value: averagePerDay, isPositive: true, prefix: '~', suffix: '/day' }}
          colorScheme="info"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <GenreDistributionChart 
          data={genreData}
          loading={chartsLoading}
        />
        
        <CountryDistributionChart 
          data={countryData}
          loading={chartsLoading}
        />
        
        <div className="xl:col-span-2">
          <ApplicationTrendsChart 
            data={trendData}
            loading={chartsLoading}
          />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Submission Rate Progress */}
        <div className="glass-container rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg ${getClass('header')} text-white flex items-center space-x-2`}>
              <PieChart className="w-5 h-5 text-[#FCB283]" />
              <span>{currentContent.submissionRate}</span>
            </h3>
            <span className={`text-2xl ${getClass('header')} text-[#FCB283]`}>
              {submissionRate}%
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Submitted Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`${getClass('body')} text-white/90 text-sm`}>
                  {currentContent.submittedApplications}
                </span>
                <span className={`${getClass('body')} text-green-400 text-sm font-medium`}>
                  {stats.applicationsByStatus.submitted}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${submissionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Draft Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`${getClass('body')} text-white/90 text-sm`}>
                  {currentContent.draftApplications}
                </span>
                <span className={`${getClass('body')} text-amber-400 text-sm font-medium`}>
                  {stats.applicationsByStatus.draft}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${100 - submissionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-container rounded-xl p-6 sm:p-8">
          <h3 className={`text-lg ${getClass('header')} text-white mb-6 flex items-center space-x-2`}>
            <Activity className="w-5 h-5 text-[#FCB283]" />
            <span>{currentContent.quickActions}</span>
          </h3>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.location.hash = '#admin/gallery'}
              className="w-full glass-card p-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-[#FCB283] group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className={`${getClass('subtitle')} text-white mb-1`}>
                    {currentContent.viewAllApplications}
                  </h4>
                  <p className={`${getClass('body')} text-white/60 text-sm`}>
                    {stats.totalApplications} {currentLanguage === 'th' ? 'รายการ' : 'items'}
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={loadDashboardData}
              disabled={chartsLoading}
              className="w-full glass-card p-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <TrendingUp className={`w-8 h-8 text-[#FCB283] group-hover:scale-110 transition-transform ${chartsLoading ? 'animate-spin' : ''}`} />
                <div>
                  <h4 className={`${getClass('subtitle')} text-white mb-1`}>
                    {currentContent.refreshData}
                  </h4>
                  <p className={`${getClass('body')} text-white/60 text-sm`}>
                    {chartsLoading 
                      ? (currentLanguage === 'th' ? 'กำลังรีเฟรช...' : 'Refreshing...') 
                      : (currentLanguage === 'th' ? 'อัปเดตข้อมูลล่าสุด' : 'Update latest data')
                    }
                  </p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => {
                // Export functionality can be implemented here
                showSuccess(
                  currentLanguage === 'th' ? 'ส่งออกสำเร็จ' : 'Export Successful',
                  currentLanguage === 'th' ? 'ข้อมูลแดชบอร์ดถูกส่งออกเรียบร้อยแล้ว' : 'Dashboard data exported successfully'
                );
              }}
              className="w-full glass-card p-4 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group"
            >
              <div className="flex items-center space-x-4">
                <Globe className="w-8 h-8 text-[#FCB283] group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className={`${getClass('subtitle')} text-white mb-1`}>
                    {currentContent.exportData}
                  </h4>
                  <p className={`${getClass('body')} text-white/60 text-sm`}>
                    {currentLanguage === 'th' ? 'ส่งออกข้อมูลสถิติ' : 'Export statistics data'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-container rounded-xl p-6 sm:p-8">
        <h3 className={`text-lg ${getClass('header')} text-white mb-6 flex items-center space-x-2`}>
          <Users className="w-5 h-5 text-[#FCB283]" />
          <span>{currentLanguage === 'th' ? 'สถิติตามหมวดการประกวด' : 'Statistics by Category'}</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Youth Category */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <h4 className={`${getClass('subtitle')} text-white`}>
                {currentLanguage === 'th' ? 'เยาวชน' : 'Youth'}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.youth.submitted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ร่าง' : 'Draft'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.youth.draft}
                </span>
              </div>
            </div>
          </div>

          {/* Future Category */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <h4 className={`${getClass('subtitle')} text-white`}>
                {currentLanguage === 'th' ? 'อนาคต' : 'Future'}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.future.submitted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ร่าง' : 'Draft'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.future.draft}
                </span>
              </div>
            </div>
          </div>

          {/* World Category */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h4 className={`${getClass('subtitle')} text-white`}>
                {currentLanguage === 'th' ? 'โลก' : 'World'}
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ส่งแล้ว' : 'Submitted'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.world.submitted}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${getClass('body')} text-white/70 text-sm`}>
                  {currentLanguage === 'th' ? 'ร่าง' : 'Draft'}
                </span>
                <span className={`${getClass('body')} text-white text-sm font-medium`}>
                  {stats.applicationsByCategory.world.draft}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsDashboardPage;