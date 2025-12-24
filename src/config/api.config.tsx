/**
 * API Configuration
 * 
 * This file contains the base API configuration.
 * Environment variables should be set in .env files.
 */

// API Base URL - defaults to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
    BY_ID: (id: string) => `/cafes/${id}`,
    STATS: (id: string) => `/cafes/${id}/stats`,
  },
} as const;

// Token storage keys - using constants to avoid typos
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'brew_admin_at',
  REFRESH_TOKEN: 'brew_admin_rt',
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;