/**
 * Dashboard Context
 * 
 * Provides dashboard analytics state and methods throughout the dashboard.
 * Handles fetching and caching of dashboard metrics, charts, etc.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import { analyticsService } from '@/services/analytics.service';
import { useCafe } from '@/contexts/CafeContext';
import type {
  DashboardPeriod,
  DashboardMetrics,
  ChartData,
  BDLVisibilityData,
  PeakHoursHeatmapData,
} from '@/types/analytics.types';

// Default empty metrics
const defaultMetrics: DashboardMetrics = {
  visits: 0,
  stamps: 0,
  bdlPosts: 0,
  newUsers: 0,
  peakHour: "N/A",
  avgFrequency: 0,
  changes: {
    visits: 0,
    stamps: 0,
    bdlPosts: 0,
    newUsers: 0,
    avgFrequency: 0,
  },
};

// Default empty chart data
const defaultChartData: ChartData = {
  labels: [],
  data: [],
};

// Default BDL visibility
const defaultBDLVisibility: BDLVisibilityData = {
  public: 0,
  private: 0,
  friends: 0,
};

// Default peak hours
const defaultPeakHours: PeakHoursHeatmapData = {
  hours: [],
  days: [],
  data: [],
};

interface DashboardContextType {
  // State
  period: DashboardPeriod;
  metrics: DashboardMetrics;
  visitsData: ChartData;
  stampsData: ChartData;
  bdlVisibility: BDLVisibilityData;
  peakHours: PeakHoursHeatmapData;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPeriod: (period: DashboardPeriod) => void;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { myCafe } = useCafe();
  
  // State
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [visitsData, setVisitsData] = useState<ChartData>(defaultChartData);
  const [stampsData, setStampsData] = useState<ChartData>(defaultChartData);
  const [bdlVisibility, setBdlVisibility] = useState<BDLVisibilityData>(defaultBDLVisibility);
  const [peakHours, setPeakHours] = useState<PeakHoursHeatmapData>(defaultPeakHours);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    if (!myCafe?.id) {
      setError('No cafe found. Please complete your cafe setup first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        metricsData,
        visitsChartData,
        stampsChartData,
        bdlData,
        peakHoursData,
      ] = await Promise.all([
        analyticsService.getDashboardMetrics(myCafe.id, period),
        analyticsService.getVisitsChart(myCafe.id, period),
        analyticsService.getStampsChart(myCafe.id, period),
        analyticsService.getBDLVisibility(myCafe.id, period),
        analyticsService.getPeakHoursHeatmap(myCafe.id, period === 'today' ? 'week' : period),
      ]);

      setMetrics(metricsData);
      setVisitsData(visitsChartData);
      setStampsData(stampsChartData);
      setBdlVisibility(bdlData);
      setPeakHours(peakHoursData);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, period]);

  /**
   * Refresh data manually
   */
  const refreshData = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Fetch data when cafe or period changes
   */
  useEffect(() => {
    if (myCafe?.id) {
      fetchDashboardData();
    }
  }, [myCafe?.id, period, fetchDashboardData]);

  // Memoize context value
  const value = useMemo<DashboardContextType>(
    () => ({
      period,
      metrics,
      visitsData,
      stampsData,
      bdlVisibility,
      peakHours,
      isLoading,
      error,
      setPeriod,
      refreshData,
    }),
    [
      period,
      metrics,
      visitsData,
      stampsData,
      bdlVisibility,
      peakHours,
      isLoading,
      error,
      refreshData,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook to access dashboard context
 */
export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}

export default DashboardContext;