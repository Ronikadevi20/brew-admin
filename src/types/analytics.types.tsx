/**
 * Analytics Types
 * 
 * Type definitions for analytics-related data structures.
 */

// Dashboard period type
export type DashboardPeriod = 'today' | 'week' | 'month';

// Analytics timeframe for API calls
export interface AnalyticsTimeframe {
  timeframe: 'day' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
}

// Dashboard metrics returned by API
export interface DashboardMetrics {
  visits: number;
  stamps: number;
  bdlPosts: number;
  newUsers: number;
  peakHour: string;
  avgFrequency: number;
  changes: {
    visits: number;
    stamps: number;
    bdlPosts: number;
    newUsers: number;
    avgFrequency: number;
  };
}

// Chart data structure
export interface ChartData {
  labels: string[];
  data: number[];
}

// BDL visibility breakdown
export interface BDLVisibilityData {
  public: number;
  private: number;
  friends: number;
}

// Peak hours heatmap data
export interface PeakHoursHeatmapData {
  hours: string[];
  days: string[];
  data: number[][];
}

// Overview stats (platform-wide)
export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalCafes: number;
  activeCafes: number;
  totalStamps: number;
  totalRedemptions: number;
  periodStart: string;
  periodEnd: string;
}

// User growth data point
export interface UserGrowthDataPoint {
  date: string;
  newUsers: number;
  totalUsers: number;
}

// Cafe performance data
export interface CafePerformance {
  cafeId: string;
  cafeName: string;
  totalVisits: number;
  uniqueVisitors: number;
  averageRating: number;
  totalReviews: number;
  completedCards: number;
}

// Popular times data
export interface PopularTimesData {
  hour: number;
  count: number;
}

// Engagement metrics
export interface EngagementMetrics {
  qrScans: number;
  stampsCollected: number;
  bdlPosts: number;
  reviews: number;
  eventsRegistered: number;
  periodStart: string;
  periodEnd: string;
}

// Retention metrics
export interface RetentionMetrics {
  activeLastWeek: number;
  activeLastMonth: number;
  totalUsers: number;
  weeklyRetentionRate: number;
  monthlyRetentionRate: number;
}

// Revenue insights
export interface RevenueInsights {
  totalStamps: number;
  totalRedemptions: number;
  estimatedRevenue: number;
  redemptionRate: number;
  avgDrinkPrice: number;
  periodStart: string;
  periodEnd: string;
}

// Cafe-specific analytics
export interface CafeAnalytics {
  cafeId: string;
  cafeName: string;
  totalStamps: number;
  uniqueVisitors: number;
  completedCards: number;
  averageRating: number;
  totalReviews: number;
  popularTimes: PopularTimesData[];
  periodStart: string;
  periodEnd: string;
}

// API Response types
export interface DashboardMetricsResponse {
  success: boolean;
  message: string;
  data: DashboardMetrics;
  timestamp: string;
}

export interface ChartDataResponse {
  success: boolean;
  message: string;
  data: ChartData;
  timestamp: string;
}

export interface BDLVisibilityResponse {
  success: boolean;
  message: string;
  data: BDLVisibilityData;
  timestamp: string;
}

export interface PeakHoursResponse {
  success: boolean;
  message: string;
  data: PeakHoursHeatmapData;
  timestamp: string;
}