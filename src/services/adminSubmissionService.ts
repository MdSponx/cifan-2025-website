import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { AdminApplicationData, DashboardStats, GenreStats, CountryStats } from '../types/admin.types';

export interface SubmissionFilters {
  category?: 'youth' | 'future' | 'world' | 'all';
  status?: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'all';
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  country?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot;
  total: number;
}

class AdminSubmissionService {
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get all submissions
      const submissionsRef = collection(db, 'submissions');
      const snapshot = await getDocs(submissionsRef);
      
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      let totalApplications = 0;
      let submittedApplications = 0;
      let draftApplications = 0;
      let recentSubmissions = 0;
      
      const categoryStats = {
        youth: { submitted: 0, draft: 0 },
        future: { submitted: 0, draft: 0 },
        world: { submitted: 0, draft: 0 }
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalApplications++;
        
        if (data.status === 'submitted') {
          submittedApplications++;
          categoryStats[data.category as keyof typeof categoryStats].submitted++;
        } else if (data.status === 'draft') {
          draftApplications++;
          categoryStats[data.category as keyof typeof categoryStats].draft++;
        }
        
        // Check if submitted in last 7 days
        if (data.submittedAt && data.submittedAt.toDate() >= sevenDaysAgo) {
          recentSubmissions++;
        }
      });

      return {
        totalApplications,
        applicationsByStatus: {
          submitted: submittedApplications,
          draft: draftApplications,
          underReview: 0, // Will need to implement review status
          accepted: 0,
          rejected: 0
        },
        applicationsByCategory: categoryStats,
        recentSubmissions,
        growthRate: 0, // Calculate based on historical data
        conversionRate: totalApplications > 0 ? (submittedApplications / totalApplications) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get genre distribution for charts
   */
  async getGenreDistribution(): Promise<GenreStats[]> {
    try {
      const submissionsRef = collection(db, 'submissions');
      const q = query(submissionsRef);
      const snapshot = await getDocs(q);
      
      const genreCount: { [key: string]: number } = {};
      let totalSubmissions = 0;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.genres && Array.isArray(data.genres)) {
          totalSubmissions++;
          data.genres.forEach((genre: string) => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        }
      });

      // Generate colors for each genre
      const colors = [
        '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
        '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'
      ];

      return Object.entries(genreCount)
        .map(([genre, count], index) => ({
        genre,
        count,
        percentage: totalSubmissions > 0 ? Math.round((count / totalSubmissions) * 100) : 0,
        color: colors[index % colors.length]
      }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching genre distribution:', error);
      throw new Error('Failed to fetch genre distribution');
    }
  }

  /**
   * Get country distribution for charts
   */
  async getCountryDistribution(): Promise<CountryStats[]> {
    try {
      const submissionsRef = collection(db, 'submissions');
      const q = query(submissionsRef);
      const snapshot = await getDocs(q);
      
      const countryCount: { [key: string]: number } = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.nationality) {
          countryCount[data.nationality] = (countryCount[data.nationality] || 0) + 1;
        }
      });

      // Country name to flag mapping (simplified)
      const countryFlags: { [key: string]: string } = {
        'Thailand': '🇹🇭',
        'United States': '🇺🇸',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'China': '🇨🇳',
        'India': '🇮🇳',
        'United Kingdom': '🇬🇧',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Australia': '🇦🇺',
        'Singapore': '🇸🇬',
        'Malaysia': '🇲🇾',
        'Philippines': '🇵🇭',
        'Vietnam': '🇻🇳',
        'Indonesia': '🇮🇩',
        'Taiwan': '🇹🇼',
        // Add more as needed
      };

      return Object.entries(countryCount)
        .map(([country, count]) => ({
          country,
          count,
          percentage: (count / snapshot.docs.length) * 100,
          flag: countryFlags[country] || '🌍'
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching country distribution:', error);
      throw new Error('Failed to fetch country distribution');
    }
  }

  /**
   * Get submission trends over time
   */
  async getSubmissionTrends(days: number = 30): Promise<Array<{ date: string; submitted: number; draft: number }>> {
    try {
      const submissionsRef = collection(db, 'submissions');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        submissionsRef, 
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'asc')
      );
      
      const snapshot = await getDocs(q);
      
      // Group by date
      const dailyStats: { [key: string]: { submitted: number; draft: number } } = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt.toDate().toISOString().split('T')[0];
        
        if (!dailyStats[date]) {
          dailyStats[date] = { submitted: 0, draft: 0 };
        }
        
        if (data.status === 'submitted') {
          dailyStats[date].submitted++;
        } else if (data.status === 'draft') {
          dailyStats[date].draft++;
        }
      });

      // Fill in missing dates with zero values
      const result = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        result.push({
          date: dateStr,
          submitted: dailyStats[dateStr]?.submitted || 0,
          draft: dailyStats[dateStr]?.draft || 0
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching submission trends:', error);
      throw new Error('Failed to fetch submission trends');
    }
  }

  /**
   * Get all submissions with filters and pagination
   */
  async getSubmissions(
    filters: SubmissionFilters = {},
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<PaginatedResult<AdminApplicationData>> {
    try {
      const submissionsRef = collection(db, 'submissions');
      let q = query(submissionsRef, orderBy('createdAt', 'desc'));

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.country) {
        q = query(q, where('country', '==', filters.country));
      }

      // Date range filter
      if (filters.dateRange?.start) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateRange.start)));
      }
      
      if (filters.dateRange?.end) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateRange.end)));
      }

      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      q = query(q, limit(pageSize + 1)); // Get one extra to check if there are more

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      
      const hasMore = docs.length > pageSize;
      const data = docs.slice(0, pageSize);
      const newLastDoc = hasMore ? data[data.length - 1] : undefined;

      const submissions: AdminApplicationData[] = data.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          applicationId: data.applicationId,
          competitionCategory: data.category,
          status: data.status,
          filmTitle: data.filmTitle,
          filmTitleTh: data.filmTitleTh,
          filmLanguage: data.filmLanguage,
          genres: data.genres || [],
          format: data.format,
          duration: data.duration,
          synopsis: data.synopsis,
          chiangmaiConnection: data.chiangmaiConnection,
          
          // Submitter data
          submitterName: data.submitterName || data.directorName,
          submitterNameTh: data.submitterNameTh || data.directorNameTh,
          submitterAge: data.submitterAge || data.directorAge,
          submitterPhone: data.submitterPhone || data.directorPhone,
          submitterEmail: data.submitterEmail || data.directorEmail,
          submitterRole: data.submitterRole || data.directorRole,
          
          // Files
          files: {
            filmFile: data.files?.filmFile || { url: '', name: '', size: 0 },
            posterFile: data.files?.posterFile || { url: '', name: '', size: 0 },
            proofFile: data.files?.proofFile
          },
          
          // Admin fields (initialize if not present)
          scores: [],
          adminNotes: '',
          reviewStatus: 'pending',
          flagged: false,
          assignedReviewers: [],
          
          // Timestamps
          submittedAt: data.submittedAt?.toDate(),
          createdAt: data.createdAt.toDate(),
          lastModified: data.lastModified.toDate()
        };
      });

      // Apply text search filter (client-side for now)
      let filteredSubmissions = submissions;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredSubmissions = submissions.filter(submission => 
          submission.filmTitle.toLowerCase().includes(searchTerm) ||
          submission.submitterName?.toLowerCase().includes(searchTerm) ||
          submission.submitterEmail?.toLowerCase().includes(searchTerm) ||
          submission.applicationId.toLowerCase().includes(searchTerm)
        );
      }

      return {
        data: filteredSubmissions,
        hasMore,
        lastDoc: newLastDoc,
        total: filteredSubmissions.length // This is approximate due to filtering
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw new Error('Failed to fetch submissions');
    }
  }

  /**
   * Get single submission by ID
   */
  async getSubmissionById(submissionId: string): Promise<AdminApplicationData | null> {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        applicationId: data.applicationId,
        competitionCategory: data.category,
        status: data.status,
        filmTitle: data.filmTitle,
        filmTitleTh: data.filmTitleTh,
        filmLanguages: data.filmLanguages || (data.filmLanguage ? [data.filmLanguage] : []), // Backward compatibility
        genres: data.genres || [],
        format: data.format,
        duration: data.duration,
        synopsis: data.synopsis,
        chiangmaiConnection: data.chiangmaiConnection,
        
        // Submitter data
        submitterName: data.submitterName || data.directorName,
        submitterNameTh: data.submitterNameTh || data.directorNameTh,
        submitterAge: data.submitterAge || data.directorAge,
        submitterPhone: data.submitterPhone || data.directorPhone,
        submitterEmail: data.submitterEmail || data.directorEmail,
        submitterRole: data.submitterRole || data.directorRole,
        
        // Files
        files: {
          filmFile: data.files?.filmFile || { url: '', name: '', size: 0 },
          posterFile: data.files?.posterFile || { url: '', name: '', size: 0 },
          proofFile: data.files?.proofFile
        },
        
        // Admin fields
        scores: (data.scores || []).map((score: any) => ({
          ...score,
          scoredAt: score.scoredAt?.toDate ? score.scoredAt.toDate() : score.scoredAt
        })),
        adminNotes: data.adminNotes || '',
        reviewStatus: data.reviewStatus || 'pending',
        flagged: data.flagged || false,
        flagReason: data.flagReason,
        assignedReviewers: data.assignedReviewers || [],
        
        // Timestamps
        submittedAt: data.submittedAt?.toDate(),
        createdAt: data.createdAt.toDate(),
        lastModified: data.lastModified.toDate(),
        lastReviewedAt: data.lastReviewedAt?.toDate()
      };
    } catch (error) {
      console.error('Error fetching submission by ID:', error);
      throw new Error('Failed to fetch submission');
    }
  }

  /**
   * Get total count of submissions (for accurate pagination)
   */
  async getTotalSubmissionsCount(filters: SubmissionFilters = {}): Promise<number> {
    try {
      const submissionsRef = collection(db, 'submissions');
      let q = query(submissionsRef);

      // Apply the same filters as getSubmissions
      if (filters.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.country) {
        q = query(q, where('country', '==', filters.country));
      }

      if (filters.dateRange?.start) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateRange.start)));
      }
      
      if (filters.dateRange?.end) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateRange.end)));
      }

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error fetching total count:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const adminSubmissionService = new AdminSubmissionService();