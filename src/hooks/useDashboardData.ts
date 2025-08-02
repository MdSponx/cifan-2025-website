import { useState, useEffect, useCallback } from 'react';
import { adminSubmissionService } from '../services/adminSubmissionService';
import { DashboardStats, GenreStats, CountryStats } from '../types/admin.types';

interface DashboardData {
  stats: DashboardStats;
  genreData: GenreStats[];
  countryData: CountryStats[];
  trendData: Array<{ date: string; submitted: number; draft: number }>;
}

interface UseDashboardDataResult {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshCharts: () => Promise<void>;
}

const initialStats: DashboardStats = {
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
};

export const useDashboardData = (autoRefresh: boolean = false, refreshInterval: number = 300000): UseDashboardDataResult => {
  const [data, setData] = useState<DashboardData>({
    stats: initialStats,
    genreData: [],
    countryData: [],
    trendData: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [stats, genreData, countryData, trendData] = await Promise.all([
        adminSubmissionService.getDashboardStats(),
        adminSubmissionService.getGenreDistribution(),
        adminSubmissionService.getCountryDistribution(),
        adminSubmissionService.getSubmissionTrends(30)
      ]);

      setData({
        stats,
        genreData,
        countryData,
        trendData
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load only stats (faster refresh)
  const refreshStats = useCallback(async () => {
    try {
      setError(null);
      const stats = await adminSubmissionService.getDashboardStats();
      setData(prev => ({ ...prev, stats }));
    } catch (err) {
      console.error('Error refreshing stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh stats');
    }
  }, []);

  // Load only chart data
  const refreshCharts = useCallback(async () => {
    try {
      setError(null);
      const [genreData, countryData, trendData] = await Promise.all([
        adminSubmissionService.getGenreDistribution(),
        adminSubmissionService.getCountryDistribution(),
        adminSubmissionService.getSubmissionTrends(30)
      ]);

      setData(prev => ({
        ...prev,
        genreData,
        countryData,
        trendData
      }));
    } catch (err) {
      console.error('Error refreshing charts:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh chart data');
    }
  }, []);

  // Full refresh
  const refresh = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      // Only refresh stats for faster updates, not charts
      refreshStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshStats]);

  return {
    data,
    loading,
    error,
    refresh,
    refreshStats,
    refreshCharts
  };
};

// Specialized hook for just stats (lighter weight)
export const useDashboardStats = (autoRefresh: boolean = false, refreshInterval: number = 60000) => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await adminSubmissionService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(loadStats, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadStats]);

  return { stats, loading, error, refresh };
};