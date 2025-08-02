import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTypography } from '../../utils/typography';
import { useAuth } from '../auth/AuthContext';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where, 
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { AdminApplicationCard as AdminApplicationCardType, GalleryFilters, PaginationState, ExportProgress } from '../../types/admin.types';
import ExportService from '../../services/exportService';
import { useNotificationHelpers } from '../ui/NotificationSystem';
import ExportDialog from '../ui/ExportDialog';
import AdminZoneHeader from '../layout/AdminZoneHeader';
import AdminApplicationCard from '../ui/AdminApplicationCard';
import { Search, Download, Filter, Calendar, ChevronLeft, ChevronRight, Grid, List, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface AdminGalleryPageProps {
  onSidebarToggle?: () => void;
}

const AdminGalleryPage: React.FC<AdminGalleryPageProps> = ({ onSidebarToggle }) => {
  const { i18n } = useTranslation();
  const { getClass } = useTypography();
  const { user } = useAuth();
  const currentLanguage = i18n.language as 'en' | 'th';

  // State management
  const [applications, setApplications] = useState<AdminApplicationCardType[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<AdminApplicationCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBulkSelect, setShowBulkSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | undefined>();
  const { showSuccess, showError } = useNotificationHelpers();
  
  // Filter and pagination state
  const [filters, setFilters] = useState<GalleryFilters>({
    category: 'all',
    status: 'all',
    dateRange: {},
    search: '',
    sortBy: 'newest',
    country: 'all'
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0
  });

  // Firestore listener cleanup
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Content translations
  const content = {
    th: {
      pageTitle: "แกลเลอรี่ใบสมัคร",
      subtitle: "จัดการและดูใบสมัครทั้งหมดในระบบ",
      searchPlaceholder: "ค้นหาชื่อภาพยนตร์, ผู้กำกับ, อีเมล...",
      filterCategory: "หมวดหมู่",
      filterStatus: "สถานะ",
      filterCountry: "ประเทศ",
      sortBy: "เรียงตาม",
      allCategories: "ทุกหมวด",
      allStatuses: "ทุกสถานะ",
      allCountries: "ทุกประเทศ",
      youth: "เยาวชน",
      future: "อนาคต",
      world: "โลก",
      draft: "ร่าง",
      submitted: "ส่งแล้ว",
      underReview: "กำลังพิจารณา",
      accepted: "ผ่าน",
      rejected: "ไม่ผ่าน",
      newest: "ใหม่สุด",
      oldest: "เก่าสุด",
      alphabetical: "ตามตัวอักษร",
      byCategory: "ตามหมวด",
      byStatus: "ตามสถานะ",
      noApplications: "ไม่พบใบสมัคร",
      noApplicationsDesc: "ไม่มีใบสมัครที่ตรงกับเงื่อนไขการค้นหา",
      loading: "กำลังโหลด...",
      loadingMore: "กำลังโหลดเพิ่มเติม...",
      viewDetails: "ดูรายละเอียด",
      exportData: "ส่งออกข้อมูล",
      totalFound: "พบทั้งหมด",
      bulkSelect: "เลือกหลายรายการ",
      selectAll: "เลือกทั้งหมด",
      clearSelection: "ยกเลิกการเลือก",
      selectedItems: "รายการที่เลือก",
      gridView: "มุมมองตาราง",
      listView: "มุมมองรายการ",
      page: "หน้า",
      of: "จาก",
      itemsPerPage: "รายการต่อหน้า",
      showingResults: "แสดงผล",
      refreshData: "รีเฟรชข้อมูล",
      offline: "ออฟไลน์",
      reconnecting: "กำลังเชื่อมต่อใหม่...",
      connectionRestored: "เชื่อมต่อกลับมาแล้ว",
      loadMore: "โหลดเพิ่มเติม",
      errorLoading: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
      retry: "ลองใหม่"
    },
    en: {
      pageTitle: "Applications Gallery",
      subtitle: "Manage and view all applications in the system",
      searchPlaceholder: "Search film titles, directors, emails...",
      filterCategory: "Category",
      filterStatus: "Status",
      filterCountry: "Country",
      sortBy: "Sort By",
      allCategories: "All Categories",
      allStatuses: "All Statuses",
      allCountries: "All Countries",
      youth: "Youth",
      future: "Future",
      world: "World",
      draft: "Draft",
      submitted: "Submitted",
      underReview: "Under Review",
      accepted: "Accepted",
      rejected: "Rejected",
      newest: "Newest",
      oldest: "Oldest",
      alphabetical: "Alphabetical",
      byCategory: "By Category",
      byStatus: "By Status",
      noApplications: "No Applications Found",
      noApplicationsDesc: "No applications match your search criteria",
      loading: "Loading...",
      loadingMore: "Loading more...",
      viewDetails: "View Details",
      exportData: "Export Data",
      totalFound: "Total Found",
      bulkSelect: "Bulk Select",
      selectAll: "Select All",
      clearSelection: "Clear Selection",
      selectedItems: "Selected Items",
      gridView: "Grid View",
      listView: "List View",
      page: "Page",
      of: "of",
      itemsPerPage: "Items per page",
      showingResults: "Showing",
      refreshData: "Refresh Data",
      offline: "Offline",
      reconnecting: "Reconnecting...",
      connectionRestored: "Connection restored",
      loadMore: "Load More",
      errorLoading: "Error loading data",
      retry: "Retry"
    }
  };

  const currentContent = content[currentLanguage];

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showSuccess(currentContent.connectionRestored);
    };
    const handleOffline = () => {
      setIsOnline(false);
      showError(currentContent.offline);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentContent, showSuccess, showError]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Real-time Firestore data loading
  const loadApplications = useCallback(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build Firestore query
      let q = query(
        collection(db, 'submissions'),
        orderBy('createdAt', 'desc'),
        limit(pagination.itemsPerPage)
      );

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        q = query(q, where('competitionCategory', '==', filters.category));
      }

      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.dateRange?.start) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(new Date(filters.dateRange.start))));
      }

      if (filters.dateRange?.end) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(new Date(filters.dateRange.end))));
      }

      // Set up real-time listener
      const unsubscribeListener = onSnapshot(
        q,
        (snapshot) => {
          const applicationsData: AdminApplicationCardType[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Map Firestore data to AdminApplicationCard type
            const application: AdminApplicationCardType = {
              id: doc.id,
              userId: data.userId || '',
              filmTitle: data.filmTitle || 'Untitled',
              filmTitleTh: data.filmTitleTh,
              directorName: data.submitterName || data.directorName || 'Unknown',
              directorNameTh: data.submitterNameTh || data.directorNameTh,
              competitionCategory: data.competitionCategory || data.category || 'youth',
              status: data.status || 'draft',
              posterUrl: data.files?.posterFile?.downloadURL || data.files?.posterFile?.url || '',
              submittedAt: data.submittedAt?.toDate(),
              createdAt: data.createdAt?.toDate() || new Date(),
              lastModified: data.lastModified?.toDate() || new Date(),
              country: data.nationality || 'Unknown',
              hasScores: data.scores && data.scores.length > 0,
              averageScore: data.scores && data.scores.length > 0 
                ? data.scores.reduce((sum: number, score: any) => sum + (score.totalScore || 0), 0) / data.scores.length 
                : undefined,
              reviewStatus: data.reviewStatus || 'pending',
              genres: data.genres || [],
              duration: data.duration || 0,
              format: data.format || 'live-action'
            };
            
            applicationsData.push(application);
          });

          setApplications(applicationsData);
          setLoading(false);
          setRefreshing(false);
          
          // Update pagination info
          setPagination(prev => ({
            ...prev,
            totalItems: applicationsData.length,
            totalPages: Math.ceil(applicationsData.length / prev.itemsPerPage)
          }));
        },
        (error) => {
          console.error('Error fetching applications:', error);
          setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล' : 'Error loading applications');
          setLoading(false);
          setRefreshing(false);
          
          showError(
            currentContent.errorLoading,
            error.message
          );
        }
      );

      // Store unsubscribe function
      setUnsubscribe(() => unsubscribeListener);

    } catch (error) {
      console.error('Error setting up listener:', error);
      setError(currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการตั้งค่าการเชื่อมต่อ' : 'Error setting up connection');
      setLoading(false);
    }
  }, [user, filters, pagination.itemsPerPage, currentLanguage, showError, currentContent]);

  // Load data on mount and filter changes
  useEffect(() => {
    loadApplications();
    
    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadApplications]);

  // Client-side filtering and sorting
  useEffect(() => {
    let filtered = [...applications];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.filmTitle.toLowerCase().includes(searchTerm) ||
        (app.filmTitleTh && app.filmTitleTh.toLowerCase().includes(searchTerm)) ||
        app.directorName.toLowerCase().includes(searchTerm) ||
        (app.directorNameTh && app.directorNameTh.toLowerCase().includes(searchTerm)) ||
        app.id.toLowerCase().includes(searchTerm)
      );
    }

    // Apply country filter
    if (filters.country && filters.country !== 'all') {
      filtered = filtered.filter(app => app.country === filters.country);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return (b.submittedAt || b.createdAt).getTime() - (a.submittedAt || a.createdAt).getTime();
        case 'oldest':
          return (a.submittedAt || a.createdAt).getTime() - (b.submittedAt || b.createdAt).getTime();
        case 'alphabetical':
          return a.filmTitle.localeCompare(b.filmTitle);
        case 'category':
          return a.competitionCategory.localeCompare(b.competitionCategory);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
    
    // Update pagination
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage)
    }));
  }, [applications, filters]);

  // Get unique countries for filter dropdown
  const uniqueCountries = Array.from(new Set(applications.map(app => app.country))).sort();

  // Paginated applications
  const paginatedApplications = React.useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, pagination.currentPage, pagination.itemsPerPage]);

  // Event handlers
  const handleFilterChange = (key: keyof GalleryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const handleExportApplications = async (options: any) => {
    try {
      const exportService = new ExportService((progress) => {
        setExportProgress(progress);
      });

      await exportService.exportApplications(filteredApplications, options);
      
      showSuccess(
        currentLanguage === 'th' ? 'ส่งออกสำเร็จ' : 'Export Successful',
        currentLanguage === 'th' ? 'ข้อมูลใบสมัครถูกส่งออกเรียบร้อยแล้ว' : 'Applications data has been exported successfully'
      );
      
      setShowExportDialog(false);
      setExportProgress(undefined);
    } catch (error) {
      showError(
        currentLanguage === 'th' ? 'การส่งออกล้มเหลว' : 'Export Failed',
        currentLanguage === 'th' ? 'เกิดข้อผิดพลาดในการส่งออกข้อมูล' : 'An error occurred while exporting data'
      );
    }
  };

  const handleBulkSelect = (id: string, selected: boolean) => {
    const newSelection = new Set(selectedItems);
    if (selected) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedApplications.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedApplications.map(app => app.id)));
    }
  };

  const handleViewApplication = (id: string) => {
    window.location.hash = `#admin/application-detail/${id}`;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEditApplication = (id: string) => {
    window.location.hash = `#admin/application/${id}/edit`;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'f':
            event.preventDefault();
            document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
            break;
          case 'r':
            event.preventDefault();
            handleRefresh();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getGridColumns = () => {
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={`grid ${getGridColumns()} gap-4 sm:gap-6`}>
      {Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
        <div key={index} className="glass-container rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-white/20"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error retry component
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
        {currentContent.errorLoading}
      </h2>
      <p className={`${getClass('body')} text-white/80 mb-6`}>
        {error}
      </p>
      <button
        onClick={handleRefresh}
        className="px-6 py-3 bg-[#FCB283] hover:bg-[#AA4626] rounded-lg text-white transition-colors"
      >
        {currentContent.retry}
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">📄</div>
      <h2 className={`text-2xl ${getClass('header')} mb-4 text-white`}>
        {currentContent.noApplications}
      </h2>
      <p className={`${getClass('body')} text-white/80 max-w-md mx-auto`}>
        {currentContent.noApplicationsDesc}
      </p>
    </div>
  );

  if (loading && applications.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        <LoadingSkeleton />
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCB283] mb-4"></div>
          <p className={`${getClass('body')} text-white/80`}>
            {currentContent.loading}
          </p>
        </div>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <AdminZoneHeader
          title={currentContent.pageTitle}
          subtitle={currentContent.subtitle}
          onSidebarToggle={onSidebarToggle || (() => {})}
        />
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Admin Zone Header */}
      <AdminZoneHeader
        title={currentContent.pageTitle}
        subtitle={currentContent.subtitle}
        onSidebarToggle={onSidebarToggle || (() => {})}
      >
        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          {!isOnline && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 rounded-lg">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">{currentContent.offline}</span>
            </div>
          )}
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            title={currentContent.refreshData}
          >
            <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#FCB283] text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
              title={currentContent.gridView}
              aria-label={currentContent.gridView}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#FCB283] text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
              title={currentContent.listView}
              aria-label={currentContent.listView}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* Export Button */}
          <button
            onClick={() => setShowExportDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FCB283] hover:bg-[#AA4626] rounded-lg text-white transition-colors"
            aria-label={currentContent.exportData}
          >
            <Download className="w-4 h-4" />
            <span className={`${getClass('menu')} text-sm hidden sm:inline`}>
              {currentContent.exportData}
            </span>
          </button>
        </div>
      </AdminZoneHeader>

      {/* Filters and Search */}
      <div className="glass-container rounded-xl p-6">
        <div className="space-y-4">
          
          {/* Search and Bulk Actions Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder={currentContent.searchPlaceholder}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#FCB283] focus:outline-none"
                aria-label="Search applications"
              />
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkSelect(!showBulkSelect)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showBulkSelect 
                    ? 'bg-[#FCB283] border-[#FCB283] text-white' 
                    : 'bg-white/10 border-white/20 text-white hover:border-[#FCB283]'
                }`}
                aria-label={currentContent.bulkSelect}
              >
                {currentContent.bulkSelect}
              </button>
              
              {showBulkSelect && (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:border-[#FCB283] transition-colors"
                    aria-label={selectedItems.size === paginatedApplications.length ? currentContent.clearSelection : currentContent.selectAll}
                  >
                    {selectedItems.size === paginatedApplications.length ? currentContent.clearSelection : currentContent.selectAll}
                  </button>
                  
                  {selectedItems.size > 0 && (
                    <span className="px-3 py-2 bg-[#FCB283]/20 text-[#FCB283] rounded-lg text-sm" role="status">
                      {selectedItems.size} {currentContent.selectedItems}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
              aria-label={currentContent.filterCategory}
            >
              <option value="all" className="bg-[#110D16]">{currentContent.allCategories}</option>
              <option value="youth" className="bg-[#110D16]">{currentContent.youth}</option>
              <option value="future" className="bg-[#110D16]">{currentContent.future}</option>
              <option value="world" className="bg-[#110D16]">{currentContent.world}</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
              aria-label={currentContent.filterStatus}
            >
              <option value="all" className="bg-[#110D16]">{currentContent.allStatuses}</option>
              <option value="submitted" className="bg-[#110D16]">{currentContent.submitted}</option>
              <option value="draft" className="bg-[#110D16]">{currentContent.draft}</option>
              <option value="under-review" className="bg-[#110D16]">{currentContent.underReview}</option>
              <option value="accepted" className="bg-[#110D16]">{currentContent.accepted}</option>
              <option value="rejected" className="bg-[#110D16]">{currentContent.rejected}</option>
            </select>

            {/* Country Filter */}
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
              aria-label={currentContent.filterCountry}
            >
              <option value="all" className="bg-[#110D16]">{currentContent.allCountries}</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country} className="bg-[#110D16]">{country}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none"
              aria-label={currentContent.sortBy}
            >
              <option value="newest" className="bg-[#110D16]">{currentContent.newest}</option>
              <option value="oldest" className="bg-[#110D16]">{currentContent.oldest}</option>
              <option value="alphabetical" className="bg-[#110D16]">{currentContent.alphabetical}</option>
              <option value="category" className="bg-[#110D16]">{currentContent.byCategory}</option>
              <option value="status" className="bg-[#110D16]">{currentContent.byStatus}</option>
            </select>

            {/* Date Range Filters */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none text-sm"
                aria-label="Start date filter"
              />
              <span className="text-white/60">-</span>
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-[#FCB283] focus:outline-none text-sm"
                aria-label="End date filter"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <p className={`${getClass('body')} text-white/70 text-sm`} role="status">
              {currentContent.showingResults} {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, filteredApplications.length)} {currentContent.of} {filteredApplications.length} {currentLanguage === 'th' ? 'รายการ' : 'items'}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className={`${getClass('body')} text-white/70 text-sm`}>
                {currentContent.itemsPerPage}:
              </span>
              <select
                value={pagination.itemsPerPage}
                onChange={(e) => setPagination(prev => ({ 
                  ...prev, 
                  itemsPerPage: parseInt(e.target.value),
                  currentPage: 1,
                  totalPages: Math.ceil(filteredApplications.length / parseInt(e.target.value))
                }))}
                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white focus:border-[#FCB283] focus:outline-none text-sm"
                aria-label="Items per page"
              >
                <option value="20" className="bg-[#110D16]">20</option>
                <option value="40" className="bg-[#110D16]">40</option>
                <option value="60" className="bg-[#110D16]">60</option>
                <option value="100" className="bg-[#110D16]">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {paginatedApplications.length > 0 ? (
        <div className={`grid ${getGridColumns()} gap-4 sm:gap-6`} role="grid">
          {paginatedApplications.map((application) => (
            <div key={application.id} role="gridcell">
              <AdminApplicationCard
                application={application}
                onView={handleViewApplication}
                onEdit={handleEditApplication}
                isSelected={selectedItems.has(application.id)}
                onSelect={handleBulkSelect}
                showBulkSelect={showBulkSelect}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Loading More Indicator */}
      {refreshing && applications.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCB283] mb-2"></div>
          <p className={`${getClass('body')} text-white/80 text-sm`}>
            {currentContent.loadingMore}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="glass-container rounded-xl p-6">
          <div className="flex items-center justify-between">
            
            {/* Page Info */}
            <p className={`${getClass('body')} text-white/70 text-sm`} role="status">
              {currentContent.page} {pagination.currentPage} {currentContent.of} {pagination.totalPages}
            </p>

            {/* Pagination Controls */}
            <nav className="flex items-center space-x-2" aria-label="Pagination navigation">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:border-[#FCB283] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pageNum === pagination.currentPage
                      ? 'bg-[#FCB283] text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:border-[#FCB283]'
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === pagination.currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:border-[#FCB283] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExportApplications}
        exportType="applications"
        availableCategories={['youth', 'future', 'world']}
        availableStatuses={['draft', 'submitted', 'under-review', 'accepted', 'rejected']}
        progress={exportProgress}
      />
    </div>
  );
};

export default AdminGalleryPage;