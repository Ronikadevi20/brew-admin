import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  DashboardPeriod,
  DashboardMetrics,
  DashboardMetricsResponse,
  ChartData,
  ChartDataResponse,
  BDLVisibilityData,
  BDLVisibilityResponse,
  PeakHoursHeatmapData,
  PeakHoursResponse,
  OverviewStats,
  UserGrowthDataPoint,
  CafePerformance,
  PopularTimesData,
  EngagementMetrics,
  RetentionMetrics,
  RevenueInsights,
  CafeAnalytics,
} from '@/types/analytics.types';

/**
 * Analytics service object containing all analytics methods
 */
export const analyticsService = {
  /**
   * Get dashboard metrics for a cafe
   */
  getDashboardMetrics: async (
    cafeId: string,
    period: DashboardPeriod = 'today'
  ): Promise<DashboardMetrics> => {
    const response = await apiClient.get<DashboardMetricsResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD.METRICS(cafeId),
      { params: { period } }
    );
    return response.data.data;
  },

  /**
   * Get visits chart data
   */
  getVisitsChart: async (
    cafeId: string,
    period: DashboardPeriod = 'today'
  ): Promise<ChartData> => {
    const response = await apiClient.get<ChartDataResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD.VISITS_CHART(cafeId),
      { params: { period } }
    );
    return response.data.data;
  },

  /**
   * Get stamps chart data
   */
  getStampsChart: async (
    cafeId: string,
    period: DashboardPeriod = 'today'
  ): Promise<ChartData> => {
    const response = await apiClient.get<ChartDataResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD.STAMPS_CHART(cafeId),
      { params: { period } }
    );
    return response.data.data;
  },

  /**
   * Get BDL visibility breakdown
   */
  getBDLVisibility: async (
    cafeId: string,
    period: DashboardPeriod = 'today'
  ): Promise<BDLVisibilityData> => {
    const response = await apiClient.get<BDLVisibilityResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD.BDL_VISIBILITY(cafeId),
      { params: { period } }
    );
    return response.data.data;
  },

  /**
   * Get peak hours heatmap data
   */
  getPeakHoursHeatmap: async (
    cafeId: string,
    period: DashboardPeriod = 'week'
  ): Promise<PeakHoursHeatmapData> => {
    const response = await apiClient.get<PeakHoursResponse>(
      API_ENDPOINTS.ANALYTICS.DASHBOARD.PEAK_HOURS(cafeId),
      { params: { period } }
    );
    return response.data.data;
  },

  /**
   * Get overview stats (platform-wide, admin only)
   */
  getOverviewStats: async (
    timeframe: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<OverviewStats> => {
    const response = await apiClient.get<{ success: boolean; data: OverviewStats }>(
      API_ENDPOINTS.ANALYTICS.OVERVIEW,
      { params: { timeframe, startDate, endDate } }
    );
    return response.data.data;
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (
    timeframe: string = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<UserGrowthDataPoint[]> => {
    const response = await apiClient.get<{ success: boolean; data: UserGrowthDataPoint[] }>(
      API_ENDPOINTS.ANALYTICS.USER_GROWTH,
      { params: { timeframe, startDate, endDate } }
    );
    return response.data.data;
  },

  /**
   * Get cafe performance rankings
   */
  getCafePerformance: async (
    timeframe: string = 'month',
    limit: number = 10
  ): Promise<CafePerformance[]> => {
    const response = await apiClient.get<{ success: boolean; data: CafePerformance[] }>(
      API_ENDPOINTS.ANALYTICS.CAFE_PERFORMANCE,
      { params: { timeframe, limit } }
    );
    return response.data.data;
  },

  /**
   * Get popular times
   */
  getPopularTimes: async (cafeId?: string): Promise<PopularTimesData[]> => {
    const response = await apiClient.get<{ success: boolean; data: PopularTimesData[] }>(
      API_ENDPOINTS.ANALYTICS.POPULAR_TIMES,
      { params: { cafeId } }
    );
    return response.data.data;
  },

  /**
   * Get engagement metrics
   */
  getEngagementMetrics: async (
    timeframe: string = 'month'
  ): Promise<EngagementMetrics> => {
    const response = await apiClient.get<{ success: boolean; data: EngagementMetrics }>(
      API_ENDPOINTS.ANALYTICS.ENGAGEMENT,
      { params: { timeframe } }
    );
    return response.data.data;
  },

  /**
   * Get retention metrics
   */
  getRetentionMetrics: async (): Promise<RetentionMetrics> => {
    const response = await apiClient.get<{ success: boolean; data: RetentionMetrics }>(
      API_ENDPOINTS.ANALYTICS.RETENTION
    );
    return response.data.data;
  },

  /**
   * Get revenue insights
   */
  getRevenueInsights: async (
    timeframe: string = 'month',
    avgDrinkPrice?: number
  ): Promise<RevenueInsights> => {
    const response = await apiClient.get<{ success: boolean; data: RevenueInsights }>(
      API_ENDPOINTS.ANALYTICS.REVENUE,
      { params: { timeframe, avgDrinkPrice } }
    );
    return response.data.data;
  },

  /**
   * Get cafe-specific analytics
   */
  getCafeAnalytics: async (
    cafeId: string,
    timeframe: string = 'month'
  ): Promise<CafeAnalytics> => {
    const response = await apiClient.get<{ success: boolean; data: CafeAnalytics }>(
      API_ENDPOINTS.ANALYTICS.CAFE(cafeId),
      { params: { timeframe } }
    );
    return response.data.data;
  },
};

export default analyticsService;