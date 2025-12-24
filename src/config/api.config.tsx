/**
 * API Configuration
 * 
 * This file contains the base API configuration.
 * Environment variables should be set in .env files.
 */

// API Base URL - defaults to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API Version
export const API_VERSION = 'v1';

// Full API URL
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    REGISTER_CAFE_ADMIN: '/auth/register-cafe-admin',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  CAFES: {
    BASE: '/cafes',
    SEARCH: '/cafes/search',
    NEARBY: '/cafes/nearby',
    BY_CITY: '/cafes/city',
    MY_CAFE: '/cafes/my-cafe',
    BY_ID: (id: string) => `/cafes/${id}`,
    STATS: (id: string) => `/cafes/${id}/stats`,
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    USER_GROWTH: '/analytics/user-growth',
    CAFE_PERFORMANCE: '/analytics/cafe-performance',
    POPULAR_TIMES: '/analytics/popular-times',
    ENGAGEMENT: '/analytics/engagement',
    RETENTION: '/analytics/retention',
    REVENUE: '/analytics/revenue',
    CAFE: (cafeId: string) => `/analytics/cafe/${cafeId}`,
    DASHBOARD: {
      METRICS: (cafeId: string) => `/analytics/dashboard/${cafeId}/metrics`,
      VISITS_CHART: (cafeId: string) => `/analytics/dashboard/${cafeId}/visits-chart`,
      STAMPS_CHART: (cafeId: string) => `/analytics/dashboard/${cafeId}/stamps-chart`,
      BDL_VISIBILITY: (cafeId: string) => `/analytics/dashboard/${cafeId}/bdl-visibility`,
      PEAK_HOURS: (cafeId: string) => `/analytics/dashboard/${cafeId}/peak-hours`,
    },
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    STATS: '/notifications/stats',
    READ_ALL: '/notifications/read-all',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    BULK: '/notifications/bulk',
  },
} as const;

// Token storage keys - using constants to avoid typos
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'brew_admin_at',
  REFRESH_TOKEN: 'brew_admin_rt',
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;