/**
 * API Client
 * 
 * Axios instance configured with interceptors for:
 * - Automatic token injection
 * - Token refresh on 401 responses
 * - Error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL, REQUEST_TIMEOUT, API_ENDPOINTS } from '@/config/api.config';
import { tokenStorage } from './token-storage';
import type { RefreshTokenResponse, ApiErrorResponse } from '@/types/auth.types';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;

// Queue of failed requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request interceptor - adds auth token to requests
 * If no access token but refresh token exists, refresh first
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();
    
    // If we have a token, use it
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    
    // If no access token but we have refresh token, try to refresh first
    // (unless this IS the refresh request)
    if (!token && refreshToken && !config.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
      // Don't block if already refreshing
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const response = await axios.post<RefreshTokenResponse>(
            `${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          tokenStorage.setAccessToken(accessToken);
          tokenStorage.setRefreshToken(newRefreshToken);
          
          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          processQueue(null, accessToken);
        } catch (error) {
          processQueue(error as Error, null);
          tokenStorage.clearAllTokens();
          throw error;
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for ongoing refresh
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        
        const newToken = tokenStorage.getAccessToken();
        if (newToken && config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handles token refresh on 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry refresh token endpoint to avoid infinite loop
    if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
      tokenStorage.clearAllTokens();
      window.location.href = '/';
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clearAllTokens();
      isRefreshing = false;
      window.location.href = '/';
      return Promise.reject(error);
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      // Updated to match the nested tokens structure
      const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(newRefreshToken);

      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      tokenStorage.clearAllTokens();
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;