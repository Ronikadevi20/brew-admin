/**
 * Cafe Admin Service
 * 
 * Handles all cafe admin API calls.
 */

import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  CafeDashboardStats,
  PinActivityData,
  PeakHour,
  RecentVisitor,
  UpdatePinRequest,
  UpdatePinResponse,
  DashboardResponse,
  PinActivityResponse,
  UpdatePinApiResponse,
  PeakHoursResponse,
  RecentVisitorsResponse,
  RewardRedemptionResult,
  ValidateRedemptionResponse,
} from '@/types/cafeadmin.types';

export const cafeAdminService = {
  /**
   * Get managed cafes
   */
  getManagedCafes: async (): Promise<any[]> => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
      API_ENDPOINTS.CAFE_ADMIN.MY_CAFES
    );
    return response.data.data;
  },

  /**
   * Get cafe dashboard stats
   */
  getDashboard: async (cafeId: string): Promise<CafeDashboardStats> => {
    const response = await apiClient.get<DashboardResponse>(
      API_ENDPOINTS.CAFE_ADMIN.DASHBOARD(cafeId)
    );
    return response.data.data;
  },

  /**
   * Update cafe PIN
   */
  updatePin: async (cafeId: string, newPin?: string): Promise<UpdatePinResponse> => {
    const data: UpdatePinRequest = { cafeId };
    if (newPin) {
      data.newPin = newPin;
    }
    const response = await apiClient.post<UpdatePinApiResponse>(
      API_ENDPOINTS.CAFE_ADMIN.UPDATE_PIN,
      data
    );
    return response.data.data;
  },

  /**
   * Get recent visitors
   */
  getRecentVisitors: async (cafeId: string, limit: number = 20): Promise<RecentVisitor[]> => {
    const response = await apiClient.get<RecentVisitorsResponse>(
      API_ENDPOINTS.CAFE_ADMIN.RECENT_VISITORS(cafeId),
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * Get today's PIN activity
   */
  getTodayPinActivity: async (cafeId: string): Promise<PinActivityData> => {
    const response = await apiClient.get<PinActivityResponse>(
      API_ENDPOINTS.CAFE_ADMIN.PIN_ACTIVITY_TODAY(cafeId)
    );
    return response.data.data;
  },

  /**
   * Get peak hours
   */
  getPeakHours: async (cafeId: string): Promise<PeakHour[]> => {
    const response = await apiClient.get<PeakHoursResponse>(
      API_ENDPOINTS.CAFE_ADMIN.PEAK_HOURS(cafeId)
    );
    return response.data.data;
  },

  /**
   * Validate and redeem a reward token (legacy QR method)
   */
  validateRedemption: async (token: string, cafeId?: string): Promise<RewardRedemptionResult> => {
    const response = await apiClient.post<ValidateRedemptionResponse>(
      API_ENDPOINTS.STAMPS.VALIDATE_REDEMPTION,
      { token, cafeId }
    );
    return response.data.data;
  },

  /**
   * Verify a 6-letter redemption code (preview only, doesn't redeem)
   */
  verifyRedemptionCode: async (code: string, cafeId: string): Promise<{
    valid: boolean;
    user: { id: string; username: string; profileImageUrl?: string };
    reward: string;
    cafeName: string;
  }> => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      API_ENDPOINTS.STAMPS.VERIFY_CODE,
      { code, cafeId }
    );
    return response.data.data;
  },

  /**
   * Redeem a verified 6-letter code
   */
  redeemCode: async (code: string, cafeId: string): Promise<RewardRedemptionResult> => {
    const response = await apiClient.post<ValidateRedemptionResponse>(
      API_ENDPOINTS.STAMPS.REDEEM_CODE,
      { code, cafeId }
    );
    return response.data.data;
  },
};

export default cafeAdminService;